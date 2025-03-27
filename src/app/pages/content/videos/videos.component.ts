import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [RouterModule],
  template: `
    <p>
      videos works!
    </p>
    <router-outlet />
  `,
  styles: ``
})
export class VideosComponent {

}
