import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';

// Importa jsPDF e autoTable para gerar o PDF
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface RegistroDeCaso {
  _id?: string;
  localizacao: string;
  descricao: string;
  profissional: string;
  data?: string;
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule
  ],
  template: `
    <mat-card class="card-container">
      <mat-card-title>Cadastro de Caso</mat-card-title>
      <form (ngSubmit)="handleSubmit()" #registroForm="ngForm" class="form-container">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Bairro (localização)</mat-label>
          <mat-select name="localizacao" [(ngModel)]="formData.localizacao" required>
            <mat-option value="">-- Selecione --</mat-option>
            <mat-option *ngFor="let bairro of BAIRROS" [value]="bairro">{{ bairro }}</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Data do Caso</mat-label>
          <input matInput [matDatepicker]="picker" name="data" [(ngModel)]="formDataDate" required>
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Descrição</mat-label>
          <input matInput type="text" name="descricao" [(ngModel)]="formData.descricao" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>ID do Profissional</mat-label>
          <input matInput type="text" name="profissional" [(ngModel)]="formData.profissional" required placeholder="Exemplo: 64f3abc123...">
        </mat-form-field>

        <button mat-raised-button color="primary" type="submit">Criar Registro</button>
      </form>

      <div *ngIf="error" class="error-message">
        {{ error }}
      </div>
    </mat-card>

    <mat-card class="card-container">
      <mat-card-title>Registros Existentes</mat-card-title>
      <div *ngIf="registros.length === 0">
        <p>Nenhum registro encontrado.</p>
      </div>
      <div *ngIf="registros.length > 0" class="table-responsive">
        <table class="registro-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Data</th>
              <th>Localização</th>
              <th>Descrição</th>
              <th>Profissional</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let registro of registros">
              <td>{{ registro._id }}</td>
              <td>{{ registro.data | date: 'shortDate' }}</td>
              <td>{{ registro.localizacao }}</td>
              <td>{{ registro.descricao }}</td>
              <td>{{ registro.profissional }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <button mat-raised-button color="accent" (click)="downloadPDF()">Baixar Relatório em PDF</button>
    </mat-card>
  `,
  styles: [`
    .card-container {
      margin: 1rem;
      padding: 1rem;
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .form-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .full-width {
      width: 100%;
    }
    .error-message {
      color: red;
      margin-top: 1rem;
    }
    .table-responsive {
      overflow-x: auto;
    }
    .registro-table {
      width: 100%;
      border-collapse: collapse;
    }
    .registro-table th, .registro-table td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    .registro-table th {
      background-color: #f2f2f2;
    }
    button[mat-raised-button] {
      margin-top: 1rem;
    }
  `]
})
export class AnalyticsComponent implements OnInit {
  // Lista de bairros para o dropdown
  BAIRROS: string[] = [
    "Soledade",
    "Dom Luciano",
    "Santos Dumont",
    "Bugio",
    "Cidade Nova",
    "Santo Antônio",
    "Palestina",
    "Dezoito do Forte",
    "José Conrado de Araújo",
    "Olaria",
    "Jardim Centenário",
    "Capucho",
    "Novo Paraíso",
    "América",
    "Siqueira Campos",
    "Getúlio Vargas",
    "Centro",
    "Industrial",
    "Porto Dantas",
    "Jabutiana",
    "Coroa do Meio",
    "Farolândia",
    "Jardins",
    "São Conrado",
    "Cirurgia",
    "Inácio Barbosa",
    "Ponto Novo",
    "Aeroporto",
    "Aruanda",
    "Areia Branca",
    "Coroa do Meio",
    "Atalaia",
    "Gameleira",
    "Matapoã",
    "Mosqueiro",
    "Areia Branca",
    "Santa Maria",
    "Robalo",
    "São José dos Náufragos"
  ];

  // Dados do formulário (exceto data)
  formData: Omit<RegistroDeCaso, 'data'> = {
    localizacao: '',
    descricao: '',
    profissional: ''
  };

  // Campo de data separado (para o datepicker)
  formDataDate: Date | null = null;

  // Registros já cadastrados
  registros: RegistroDeCaso[] = [];
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchRegistros();
  }

  // Busca os registros existentes da API
  fetchRegistros(): void {
    this.http.get<RegistroDeCaso[]>('http://52.90.31.216:5000/api/registro-caso')
      .subscribe({
        next: (data) => {
          this.registros = data;
          this.error = null;
        },
        error: (err) => {
          console.error('Erro ao obter registros:', err);
          this.error = 'Não foi possível carregar os registros.';
        }
      });
  }

  // Envia o novo registro para a API
  handleSubmit(): void {
    const dateISO = this.formDataDate ? this.formDataDate.toISOString() : new Date().toISOString();
    const payload: RegistroDeCaso = {
      data: dateISO,
      ...this.formData
    };

    this.http.post<RegistroDeCaso>('http://44.202.92.78:5000/api/registro-caso', payload)
      .subscribe({
        next: (novoRegistro) => {
          this.registros.push(novoRegistro);
          this.formData = { localizacao: '', descricao: '', profissional: '' };
          this.formDataDate = null;
          this.error = null;
        },
        error: (err) => {
          console.error('Erro ao criar registro:', err);
          this.error = 'Não foi possível criar o registro. Verifique se o ID do profissional é válido.';
        }
      });
  }

  // Gera o PDF a partir da tabela atual
  downloadPDF(): void {
    const doc = new jsPDF();
  
    const columns = ['ID', 'Data', 'Localização', 'Descrição', 'Profissional'];
    const rows = this.registros.map(registro => [
      registro._id || '', // se _id for undefined, usa string vazia
      registro.data ? new Date(registro.data).toLocaleDateString() : '',
      registro.localizacao,
      registro.descricao,
      registro.profissional
    ]);
  
    autoTable(doc, {
      head: [columns],
      body: rows,
      margin: { top: 20 },
      styles: { fontSize: 8 }
    });
  
    doc.save('relatorio-casos.pdf');
  }
  
}
