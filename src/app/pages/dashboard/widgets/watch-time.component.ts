import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import Map from 'ol/Map';
import View from 'ol/View';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM } from 'ol/source';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Fill, Stroke, Style } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import { defaults as defaultInteractions } from 'ol/interaction';
import Overlay from 'ol/Overlay';

@Component({
  selector: 'app-heatmap-openlayers',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <div class="map-container">
      <div class="map-header">
        <h2>Mapa (OpenLayers) - Aracaju</h2>
        <button class="gear-btn">⚙️</button>
      </div>
      <div #mapRef class="map"></div>
      <!-- Popup overlay -->
      <div id="popup" class="ol-popup">
        <a href="#" id="popup-closer" class="ol-popup-closer" (click)="closePopup($event)"></a>
        <div id="popup-content"></div>
      </div>
    </div>
  `,
  styles: [`
    .map-container {
      position: relative;
      width: 100%;
      height: 80vh;
      border: 1px solid #ddd;
      border-radius: 0.5rem;
      background-color: #f5f5f5;
      overflow: hidden;
    }
    .map-header {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 50px;
      background-color: #eaeaea;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px;
      z-index: 10;
      box-sizing: border-box;
    }
    .gear-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      z-index: 20;
    }
    .map {
      position: absolute;
      top: 50px;
      left: 0;
      right: 0;
      bottom: 0;
    }
    .ol-popup {
      position: absolute;
      background-color: rgba(255, 255, 255, 0.8);
      box-shadow: 0 1px 4px rgba(0,0,0,0.2);
      padding: 15px;
      border-radius: 10px;
      border: 1px solid #cccccc;
      bottom: 12px;
      left: -50px;
      min-width: 200px;
      z-index: 100;
    }
    .ol-popup:after, .ol-popup:before {
      top: 100%;
      border: solid transparent;
      content: " ";
      height: 0;
      width: 0;
      position: absolute;
      pointer-events: none;
    }
    .ol-popup:after {
      border-top-color: rgba(255,255,255,0.8);
      border-width: 10px;
      left: 48px;
      margin-left: -10px;
    }
    .ol-popup:before {
      border-top-color: #cccccc;
      border-width: 11px;
      left: 48px;
      margin-left: -11px;
    }
    .ol-popup-closer {
      text-decoration: none;
      position: absolute;
      top: 2px;
      right: 8px;
      font-size: 16px;
      color: #c3c3c3;
    }
    .ol-popup-closer:after {
      content: "✖";
    }
    /* Opcional: reduzir a opacidade da atribuição do OSM */
    .ol-attribution {
      opacity: 0.5;
    }
  `]
})
export class HeatmapComponent implements OnInit, AfterViewInit {
  @ViewChild('mapRef', { static: true }) mapRef!: ElementRef<HTMLDivElement>;
  map!: Map;
  overlay!: Overlay;

  casesData: any[] = [];
  aracajuGeoJson: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Carrega o GeoJSON dos bairros
    this.http.get('assets/aracaju.geojson').subscribe({
      next: data => {
        this.aracajuGeoJson = data;
        this.initializeMapIfReady();
      },
      error: err => console.error('Erro ao carregar GeoJSON:', err)
    });

    // Carrega os dados dos casos
    this.http.get<any[]>('http://44.202.92.78:5000/api/registro-caso').subscribe({
      next: data => {
        this.casesData = data;
        this.initializeMapIfReady();
      },
      error: err => console.error('Erro ao carregar dados dos casos:', err)
    });
  }

  ngAfterViewInit(): void {
    // Ajusta o tamanho do mapa se necessário
    setTimeout(() => {
      if (this.map) {
        this.map.updateSize();
      }
    }, 300);
  }

  // Função auxiliar para converter hex para rgba com alpha
  private hexToRgba(hex: string, alpha: number): string {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
      hex = hex.split('').map(ch => ch + ch).join('');
    }
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  initializeMapIfReady(): void {
    if (!this.aracajuGeoJson || !this.casesData.length) return;
    if (this.map) return;

    // Agrupa os casos por bairro
    const countsByBairro: Record<string, number> = {};
    this.casesData.forEach(item => {
      const bairro = item.localizacao?.trim() || 'Desconhecido';
      countsByBairro[bairro] = (countsByBairro[bairro] || 0) + 1;
    });

    const getColor = (count: number) => {
      return count > 20 ? '#800026' :
             count > 10 ? '#BD0026' :
             count > 5  ? '#E31A1C' :
             count > 2  ? '#FC4E2A' :
             count > 0  ? '#FD8D3C' : '#FFEDA0';
    };

    // Função de estilo com transparência (alpha = 0.5)
    const styleFunction = (feature: any) => {
      const nomeBairro = feature.get('name') || 'Desconhecido';
      const count = countsByBairro[nomeBairro] || 0;
      return new Style({
        fill: new Fill({
          color: this.hexToRgba(getColor(count), 0.5)
        }),
        stroke: new Stroke({
          color: '#fff',
          width: 1
        })
      });
    };

    // Cria a fonte vetorial a partir do GeoJSON
    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(this.aracajuGeoJson, {
        featureProjection: 'EPSG:3857'
      })
    });

    // Cria a camada vetorial com o estilo definido
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: styleFunction
    });

    // Camada de tiles (OSM) sem atribuição (ou com atribuição customizada)
    const tileLayer = new TileLayer({
      source: new OSM({ attributions: [] })
    });

    this.map = new Map({
      target: this.mapRef.nativeElement,
      layers: [ tileLayer, vectorLayer ],
      view: new View({
        center: fromLonLat([-37.07, -10.95]),
        zoom: 12
      }),
      interactions: defaultInteractions()
    });

    // Cria o overlay para o popup nativo
    const popupContainer = document.getElementById('popup')!;
    this.overlay = new Overlay({
      element: popupContainer,
      autoPan: {
        animation: { duration: 250 }
      }
    });
    this.map.addOverlay(this.overlay);

    // Evento de clique para exibir o popup
    this.map.on('singleclick', (evt: any) => {
      this.map.forEachFeatureAtPixel(evt.pixel, (feature: any) => {
        const nomeBairro = feature.get('name') || 'Desconhecido';
        const count = countsByBairro[nomeBairro] || 0;
        const content = document.getElementById('popup-content')!;
        content.innerHTML = `<strong>${nomeBairro}</strong><br/>Ocorrências: ${count}`;
        this.overlay.setPosition(evt.coordinate);
      });
    });
  }

  closePopup(evt: Event): void {
    evt.preventDefault();
    this.overlay.setPosition(undefined);
  }
}
