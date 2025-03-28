import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Chart from 'chart.js/auto';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-view-analytics',
  standalone: true,
  imports: [MatButtonModule, HttpClientModule],
  template: `
    <div class="chart-container">
      <canvas #chart></canvas>
      <button mat-raised-button class="mt-16" routerLink="/analytics">Go to channel analytics</button>
    </div>
  `,
  styles: [`
    .chart-container {
      height: calc(90% - 50px);
      width: 100%;
      overflow: auto;
    }
  `]
})
export class ViewAnalyticsComponent implements AfterViewInit {
  @ViewChild('chart') chartRef!: ElementRef<HTMLCanvasElement>;

  constructor(private http: HttpClient) { }

  ngAfterViewInit() {
    this.http.get<any[]>('http://52.90.31.216:5000/api/registro-caso')
      .subscribe(data => {
        // Agrupa os registros pela descrição da doença
        const diseaseCount: { [key: string]: number } = {};
        data.forEach(item => {
          const descricao = item.descricao.toLowerCase().trim();
          diseaseCount[descricao] = (diseaseCount[descricao] || 0) + 1;
        });

        const labels = Object.keys(diseaseCount);
        const counts = Object.values(diseaseCount);
        
        // Paleta fixa de cores (azul, vermelho, amarelo, verde, etc.)
        const palette = ['#007bff', '#ffc107', '#dc3545',  '#28a745', '#fd7e14', '#6f42c1', '#17a2b8'];
        // Atribui uma cor de forma cíclica para cada tipo de doença
        const backgroundColors = labels.map((_, index) => palette[index % palette.length]);

        new Chart(this.chartRef.nativeElement, {
          type: 'doughnut',
          data: {
            labels: labels,
            datasets: [{
              data: counts,
              backgroundColor: backgroundColors
            }]
          },
          options: {
            responsive: true,
          }
        });
      });
  }
}
