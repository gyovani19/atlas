import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Chart from 'chart.js/auto';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [MatButtonModule, HttpClientModule, FormsModule],
  template: `
    <div class="chart-container">
      <div class="controls">
        <label for="doencaSelect">Selecione a doença:</label>
        <select id="doencaSelect" (change)="onDoencaChange($event)">
          <option value="todas">Todas as doenças</option>
          <option *ngFor="let doenca of doencas" [value]="doenca">{{ doenca }}</option>
        </select>
      </div>
      <canvas #chart></canvas>
    </div>
    <button mat-raised-button class="mt-16" routerLink="/analytics">
      Ir para análise de canal
    </button>
  `,
  styles: [`
    .chart-container {
      height: calc(90% - 50px);
      width: 100%;
      overflow: auto;
    }
    .controls {
      margin-bottom: 16px;
    }
  `]
})
export class AnalyticsComponent implements AfterViewInit {
  @ViewChild('chart') chartRef!: ElementRef<HTMLCanvasElement>;
  chartInstance: Chart | null = null;
  rawData: any[] = [];
  doencas: string[] = [];
  doencaSelecionada: string = 'todas';
  xLabels: string[] = [];
  // Paleta fixa de cores
  palette: string[] = ['#007bff', '#ffc107','#dc3545',  '#28a745', '#fd7e14', '#6f42c1', '#17a2b8'];

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    // Consome o endpoint e armazena os dados
    this.http.get<any[]>('http://44.202.92.78:5000/api/registro-caso')
      .subscribe(data => {
        this.rawData = data;
        // Extrai os nomes únicos das doenças (normalizados para minúsculas)
        const setDoencas = new Set<string>();
        data.forEach(item => {
          const doenca = item.descricao.toLowerCase().trim();
          setDoencas.add(doenca);
        });
        this.doencas = Array.from(setDoencas);
        this.atualizaGrafico();
      });
  }

  atualizaGrafico() {
    // Agrupa os dados por data (formato ISO YYYY-MM-DD) e por doença
    const dadosAgrupados: { [doenca: string]: { [data: string]: number } } = {};
    const datasSet = new Set<string>();

    this.rawData.forEach(item => {
      const doenca = item.descricao.toLowerCase().trim();
      // Obtém a data no formato ISO (YYYY-MM-DD)
      const dataISO = new Date(item.data).toISOString().slice(0, 10);
      datasSet.add(dataISO);
      if (!dadosAgrupados[doenca]) {
        dadosAgrupados[doenca] = {};
      }
      dadosAgrupados[doenca][dataISO] = (dadosAgrupados[doenca][dataISO] || 0) + 1;
    });

    // Ordena as datas e formata para pt-BR
    const datasOrdenadas = Array.from(datasSet).sort();
    this.xLabels = datasOrdenadas.map(dataISO => new Date(dataISO).toLocaleDateString('pt-BR'));

    let datasets: any[] = [];
    if (this.doencaSelecionada === 'todas') {
      // Exibe todas as doenças com uma linha para cada
      this.doencas.forEach((doenca, index) => {
        const counts = datasOrdenadas.map(dataISO => dadosAgrupados[doenca][dataISO] || 0);
        datasets.push({
          label: doenca,
          data: counts,
          borderColor: this.palette[index % this.palette.length],
          backgroundColor: this.palette[index % this.palette.length],
          fill: false,
        });
      });
    } else {
      // Exibe somente a doença selecionada
      const counts = datasOrdenadas.map(dataISO => dadosAgrupados[this.doencaSelecionada][dataISO] || 0);
      datasets.push({
        label: this.doencaSelecionada,
        data: counts,
        borderColor: this.palette[0],
        backgroundColor: this.palette[0],
        fill: false,
      });
    }

    // Se já existir um gráfico, destrói-o antes de recriar
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    // Cria o gráfico do tipo linha
    this.chartInstance = new Chart(this.chartRef.nativeElement, {
      type: 'line',
      data: {
        labels: this.xLabels,
        datasets: datasets
      },
      options: {
        maintainAspectRatio: false,
        elements: {
          line: {
            tension: 0.4,
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Data'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Número de casos'
            },
            beginAtZero: true
          }
        }
      }
    });
  }

  onDoencaChange(event: any) {
    this.doencaSelecionada = event.target.value;
    this.atualizaGrafico();
  }
}
