import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [RouterModule],
  template: `
    <p>
      content works!
    </p>
    <router-outlet />
  `,
  styles: ``
})
export class ContentComponent {

}
