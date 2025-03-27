import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidenavComponent } from './components/sidenav/sidenav.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, MatToolbarModule, MatIconModule, MatButtonModule, MatSidenavModule, SidenavComponent],
  template: `
    <mat-toolbar class="mat-elevation-z3">
    <button mat-icon-button class="menu-icon" aria-label="Menu icon" (click)="collapsed.set(!collapsed())">
    <mat-icon>menu</mat-icon>
    </button>
    </mat-toolbar>
    <mat-sidenav-container>
      <mat-sidenav mode="side" opened [style.width]="setNavWidth()">
        <app-sidenav [collapsed]="collapsed()"/>
      </mat-sidenav>
      <mat-sidenav-content class="content" [style.margin-left]="setNavWidth()">
      <router-outlet />
      </mat-sidenav-content>
    </mat-sidenav-container>
    
  `,
  styles: [
    `
    :host *{
    transition: all 500ms ease-in-out;
  }

    mat-toolbar {
      position: relative;
      z-index: 5;
    }

    .content {
      padding: 24px;
    }

    mat-sidenav-container {
      height: calc(100% - 64px);
      padding-bottom: 2rem;
    }

    mat-sidenav,
    mat-sidenav-content{
      transition: all 500ms ease-in-out;
    }
    `
  ],
})
export class AppComponent {
  title = 'Dashboard';

  collapsed = signal(false);

  setNavWidth() {
    return this.collapsed() ? '70px' : '250px';
  }
}
