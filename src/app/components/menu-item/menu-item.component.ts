import { Component, computed, input, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MenuItem } from '../sidenav/sidenav.component';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-menu-item',
  standalone: true,
  animations: [
    trigger('expandContractMenu', [
      transition(':enter', [
        style({opacity: 0, height: '0px'}),
        animate('500ms ease-in-out', style({opacity:1, height: '*'}))
      ]),
      transition(':leave', [
        animate('500ms ease-in-out', style({opacity:0, height:'0px'}))
      ])
    ])
  ],
  imports: [MatListModule, MatIconModule, RouterModule],
  template: `
    <a mat-list-item [routerLink]="routeHistory() + '/' +menu().route" class="nav-items" (click)="toggleNestedMenu()" [style.--mat-list-list-item-leading-icon-start-space] = "indentation()" routerLinkActive="selected-side-nav" #rla="routerLinkActive" [activated]="rla.isActive">
        <mat-icon matListItemIcon>{{menu().icon}} [fontSet]="rls.isActive ? 'material-icons' : 'material-icons-outlined'"</mat-icon>
        @if (!collapsed()) {
          <span matListItemTitle>{{menu().label}}</span>
        }
        <span matListItemMeta>
          @if(menu().subMenu) {
            @if(nestedMenuCollapsed()){ <mat-icon>expand_less</mat-icon>
            }
            @else { 
              <mat-icon>expand_more</mat-icon>
            }
          }
        </span>        
      </a>

      @if(menu().subMenu && nestedMenuCollapsed()){
        <div @expandContractMenu>
          @for (subItem of menu().subMenu; track subItem.label) {
      <!-- //       <a mat-list-item [routerLink]="menu().route + '/' + subItem.route" class="nav-items" [class.indentation]="!collapsed()" routerLinkActive #rla="routerLinkActive" [activated]="rla.isActive">
      //       <mat-icon matListItemIcon>{{subItem.icon}} [fontSet]="rls.isActive ? 'material-icons' : 'material-icons-outlined'"</mat-icon>
      //       @if (!collapsed()) {
      //         <span matListItemTitle>{{subItem.label}}</span>
      //       }       
      // </a> -->

      <app-menu-item [menu]="subItem" [collapsed]="collapsed()" [routeHistory]="routeHistory() + '/' + menu().route"/>
          }
        </div>
      }
  `,
  styles: `
  
  :host *{
    transition: all 500ms ease-in-out;
  }

  .nav-items{
    border-left: 5px solid;
    border-left-color: rgba(0,0,0,0);
  }

  .selected-side-nav{
    border-left-color: #673ab7;
    background-color: #673ab761 !important;
  }

  .indentation{
    --mat-list-list-item-leading-icon-start-space: 48px;
  }
  `
})
export class MenuItemComponent {

  menu = input.required<MenuItem>();
  collapsed = input(false);
  nestedMenuCollapsed = signal(false);
  routeHistory = input('');

  level = computed(() => this.routeHistory().split('/').length);

  indentation = computed(() => this.collapsed() ? '16px' : `${(16 + this.level() * 16)}px`);

  toggleNestedMenu() {
    if (!this.menu().subMenu) return;
    this.nestedMenuCollapsed.set(!this.nestedMenuCollapsed());
  }
}
