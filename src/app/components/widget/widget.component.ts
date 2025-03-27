import { Component, input, signal } from '@angular/core';
import { Widget } from '../../models/dashboard.model';
import { NgComponentOutlet } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { WidgetSettingsComponent } from './widget-settings/widget-settings.component';

@Component({
  selector: 'app-widget',
  standalone: true,
  imports: [NgComponentOutlet, MatButtonModule, MatIcon, WidgetSettingsComponent],
  template: `
    <div class="container mat-elevation-z3" [style.background-color]="data().bgColor ?? '#f5f5f59c'" [style.color]="data().color ?? '#424242'">
      <h3 class="m-0">{{data().label}}</h3>
      <button mat-icon-button class="settings-button" (click)="showOptions.set(true)">
        <mat-icon>settings-button</mat-icon>
      </button>
      <ng-container [ngComponentOutlet]="data().content" />

      @if (showOptions()) {
        <app-widget-settings [(showOptions)]="showOptions" [data]="data()"/>
      }
    </div>
  `,
  styles: `
    :host {
      background: #f4f4f4;
      display: block;
      border-radius: 32px;
    }
    
    .container {
      position: relative;
      height: 100%;
      width: 100%;
      padding: 32px;
      box-sizing: border-box;
      border-radius: inherit;
      overflow: hidden;
    }

    .settings-button {
      position: absolute;
      top: 10px;
      right: 5px;
    }
  `,
  host: {
    '[style.grid-area]': '"span " + (data().rows ?? 1) + "/ span " + (data().columns ?? 1)'
  }
})
export class WidgetComponent {
  data = input.required<Widget>();
  showOptions = signal(false);
}
