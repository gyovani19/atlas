import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-views',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <div class="widget-container">
      <div class="widget-header">
        <h2>Total de Casos</h2>
      </div>
      <div class="widget-content">
        <div class="total-cases">{{ totalCases }}</div>
        <div class="max-bairro">
          Bairro com mais casos: <span>{{ maxBairro }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    .widget-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 1rem;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .widget-header {
      width: 100%;
      text-align: center;
      margin-bottom: 1rem;
    }
    .widget-header h2 {
      margin: 0;
      font-size: clamp(1.2rem, 4vw, 2rem);
      font-weight: bold;
      color: #333;
    }
    .widget-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex: 1;
      width: 100%;
      text-align: center;
    }
    .total-cases {
      font-size: clamp(1rem, 10vw, 3rem);
      font-weight: bold;
      color: #007bff;
      line-height: 1;
    }
    .max-bairro {
      font-size: clamp(0.5rem, 5vw, 1.5rem);
      color: #555;
      margin-top: 0.5rem;
    }
  `]
})
export class ViewsComponent implements OnInit {
  totalCases: number = 0;
  maxBairro: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://44.202.92.78:5000/api/registro-caso')
      .subscribe({
        next: data => {
          this.totalCases = data.length;
          const counts: Record<string, number> = {};
          data.forEach(item => {
            const bairro = item.localizacao ? item.localizacao.trim() : 'Desconhecido';
            counts[bairro] = (counts[bairro] || 0) + 1;
          });
          let maxCount = 0;
          let bairroMax = '';
          for (const bairro in counts) {
            if (counts[bairro] > maxCount) {
              maxCount = counts[bairro];
              bairroMax = bairro;
            }
          }
          this.maxBairro = bairroMax;
        },
        error: err => console.error('Erro ao carregar os dados:', err)
      });
  }
}
