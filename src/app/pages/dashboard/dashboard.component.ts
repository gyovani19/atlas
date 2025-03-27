import { Component, ElementRef, inject, OnInit, viewChild } from '@angular/core';
import { WidgetComponent } from "../../components/widget/widget.component";
import { DashboardService } from '../../services/dashboard.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { wrapGrid } from 'animate-css-grid';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [WidgetComponent, MatButtonModule, MatIcon, MatMenuModule],
  providers: [DashboardService],
  template: `
    <div class="header">
    <h2>Atlas Endêmico</h2>
    <button mat-raised-button [mat-menu-trigger-for]="widgetMenu">
      <mat-icon>add_circle</mat-icon>
      Adicionar Widget
    </button>
    <mat-menu #widgetMenu="matMenu">
      @for (widget of store.widgetsToAdd(); track widget.id) {
        <button mat-menu-item (click)="store.addWidget(widget)">{{widget.label}}</button>
      } @empty {
       <button mat-menu-item disabled>Sem widgets pra adicionar</button>
      }
    </mat-menu>
</div>
    <div class="dashboard-widgets" #dashboard>
      @for (item of store.addedWidgets(); track item.id) {
        <app-widget [data]="item"/>
      }
    </div>
  `,
  styles: `
  :host{
    --mdc-protected-button-container-shape: 16px;
  }

    .dashboard-widgets {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      grid-auto-rows: 150px;
      gap: 16px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `
})
export class DashboardComponent {
  store = inject(DashboardService);
  dashboard = viewChild.required<ElementRef>('dashboard');

  ngAfterViewInit() {
    wrapGrid(this.dashboard().nativeElement, { duration: 300 });
  }
}
