import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-revenue',
  standalone: true,
  imports: [CommonModule, HttpClientModule, MatCardModule],
  template: `
    <mat-card class="card-container">
      <mat-card-title>Bairros com Mais Casos</mat-card-title>
      <div class="chart-container">
        <canvas #chart></canvas>
      </div>
    </mat-card>
  `,
  styles: [`
    .card-container {
      margin: 1rem;
      padding: 1rem;
      background-color: #f5f5f5; /* Fundo harmonizado com outros widgets */
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .chart-container {
      height: calc(90% - 50px);
      width: 100%;
      overflow-x: auto;  /* Barra de rolagem horizontal se necessário */
      padding: 1rem;
    }
    /* Força o canvas a ter um tamanho mínimo para que os rótulos não se comprimam */
    canvas {
      min-width: 600px;
    }
  `]
})
export class RevenueComponent implements AfterViewInit {
  @ViewChild('chart') chartRef!: ElementRef<HTMLCanvasElement>;

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.http.get<any[]>('http://44.202.92.78:5000/api/registro-caso')
      .subscribe(data => {
        // Agrupa os registros pelo bairro (localizacao)
        const counts: { [bairro: string]: number } = {};
        data.forEach(item => {
          const bairro = item.localizacao;
          counts[bairro] = (counts[bairro] || 0) + 1;
        });

        // Converte o objeto em array e ordena em ordem decrescente
        const agrupados = Object.entries(counts)
          .map(([bairro, casos]) => ({ bairro, casos }))
          .sort((a, b) => b.casos - a.casos);

        // Limita aos top 10 bairros
        const top10 = agrupados.slice(0, 10);
        const labels = top10.map(item => item.bairro);
        const dataValues = top10.map(item => item.casos);

        // Alterna cores: índices pares recebem azul, ímpares, amarelo
        const backgroundColors = labels.map((_, index) =>
          index % 2 === 0 ? '#36A2EB' : '#FFCE56'
        );
        const borderColors = backgroundColors;

        new Chart(this.chartRef.nativeElement, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Número de Casos',
              data: dataValues,
              backgroundColor: backgroundColors,
              borderColor: borderColors,
              borderWidth: 1,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: 10
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Bairro'
                },
                ticks: {
                  autoSkip: false,
                  maxRotation: 45,
                  minRotation: 45,
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Número de Casos'
                },
                beginAtZero: true,
                ticks: {
                  precision: 0
                }
              }
            },
            plugins: {
              legend: {
                display: false
              }
            }
          }
        });
      });
  }
}
