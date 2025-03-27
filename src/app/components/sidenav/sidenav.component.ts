import { Component, computed, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MenuItemComponent } from "../menu-item/menu-item.component";

export type MenuItem = {
  label: string,
  icon: string,
  route?: string,
  subMenu?: MenuItem[]
}

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, RouterModule, MenuItemComponent],
  template: `
    <div class="sidenav-header">
      <img [width]="profileSize()" [height]="profileSize()" src="/assets/images/profile.jpg" alt="" srcset="">
      <div class="header-text" [class.hide-header-text]="sideNavCollapsed()">
        <h2>Gyovani Santos</h2>
        <p>Secretário da Saúde</p>
      </div>
    </div>
    <mat-nav-list class="menu-list">
      @for(item of menuItems(); track item.label) {
        <app-menu-item [menu]="item" [collapsed]="sideNavCollapsed()"/>
      }      
    </mat-nav-list>
  `,
  styles: [`
    .sidenav-header {
      padding: 1rem;
      text-align: center;

      > img {
        border-radius: 100%;
        // object-fit: cover;
      }
    }

    .header-text {
      height: 3rem;

      > h2 {
        margin: 0;
        font-size: 1rem;
        line-height: 1.5rem;
      }
      
      > p {
        margin: 0;
        font-size: 0.8rem;
      }
    }

    .hide-header-text{
    opacity: 0;
    height: 0px !important;
    }

    .menu-list{
     > mat-icon {
      margin-right: 1rem;
    }
    }
   
    `]
})
export class SidenavComponent {
  sideNavCollapsed = signal(false);

  @Input() set collapsed(val: boolean) {
    this.sideNavCollapsed.set(val);
  }

  menuItems = signal<MenuItem[]>([
    {
      icon: 'dashboard',
      label: 'Dashboard',
      route: 'dashboard'
    },
    {
      icon: 'analytics',
      label: 'Casos',
      route: 'analytics'
    }, {
      icon: 'people_outline',
      label: 'Equipe',
      route: 'comments'
    }
  ])

  profileSize = computed(() => this.sideNavCollapsed() ? '32' : '100')
}
