import { computed, Injectable, signal } from '@angular/core';
import { Widget } from '../models/dashboard.model';
import { ViewsComponent } from '../pages/dashboard/widgets/views/views.component';
import { RevenueComponent } from '../pages/dashboard/widgets/revenue.component';
import { HeatmapComponent } from '../pages/dashboard/widgets/watch-time.component';
import { AnalyticsComponent } from '../pages/dashboard/widgets/analytics.component';
import { ViewAnalyticsComponent } from '../pages/dashboard/widgets/view-analytics.component';

@Injectable()
export class DashboardService {
  widgets = signal<Widget[]>([
   
    {
      id: 2,
      label: 'Panorama Geral',
      content: ViewsComponent
    },
    {
      id: 3,
      label: 'Mapa de Calor',
      content: HeatmapComponent
    },
    {
      id: 4,
      label: 'Casos por Bairro',
      content: RevenueComponent
    },
    {
      id: 5,
      label: 'Revenue-Analytics',
      content: AnalyticsComponent
    },
    {
      id: 6,
      label: 'View-Analytics',
      content: ViewAnalyticsComponent
    },
    {
      id: 2,
      label: 'Panorama Geral',
      content: ViewsComponent 
    },
  ]);

  addedWidgets = signal<Widget[]>([ 
    
    {
      id: 3,
      label: 'Mapa de Calor',
      content: HeatmapComponent,
      rows: 3,
      columns: 3
    },
    {
    id: 6,
    label: 'Tipos de Caso',
    content: ViewAnalyticsComponent,
    rows: 3,
    columns: 2
  },
  {
    id: 2,
    label: 'Panorama Geral',
    content: ViewsComponent ,
    rows: 3,
    columns: 1
  },
  {
    id: 5,
    label: 'Histórico de Casos',
    content: AnalyticsComponent,
    rows: 3,
    columns: 3
  },
  {
    id: 4,
    label: 'Casos por Bairro',
    content: RevenueComponent,
    rows: 3,
    columns: 3
  },

  
]);
  widgetsToAdd = computed(() => {
    const addedIds = this.addedWidgets().map(w => w.id);
    return this.widgets().filter(w => !addedIds.includes(w.id));
  });

  constructor() { }

  addWidget(w: Widget){
    this.addedWidgets.set([...this.addedWidgets(), {...w}]);
  }

  updateWidgetSize(id: number, widget: Partial<Widget>){
    debugger;
    const index = this.addedWidgets().findIndex(w => w.id === id);
    if(index != -1){
      const newWidget = [...this.addedWidgets()];
      newWidget[index] = {...newWidget[index], ...widget};
      this.addedWidgets.set(newWidget);
    }
  }

  moveWidgetRight(id: number) {
    const index = this.addedWidgets().findIndex(w => w.id === id);
    if(index === this.addedWidgets().length - 1) return;
    const newWidgets = [...this.addedWidgets()];
    [newWidgets[index], newWidgets[index+1]] = [{...newWidgets[index+1]}, {...newWidgets[index]}];

    this.addedWidgets.set(newWidgets);
  }

  moveWidgetLeft(id: number) {
    const index = this.addedWidgets().findIndex(w => w.id === id);
    if(index === 0) return;
    const newWidgets = [...this.addedWidgets()];
    [ newWidgets[index-1], newWidgets[index]] = [{...newWidgets[index]}, {...newWidgets[index-1]}];

    this.addedWidgets.set(newWidgets);
  }

  deleteWidget(id: number){
    this.addedWidgets.set(this.addedWidgets().filter(w => w.id != id));
  }
}
