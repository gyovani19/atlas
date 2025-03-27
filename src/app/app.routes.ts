import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AnalyticsComponent } from './pages/analytics/analytics.component';
import { ContentComponent } from './pages/content/content.component';
import { CommentsComponent } from './pages/comments/comments.component';
import { ShortsComponent } from './pages/content/videos/shorts/shorts.component';
import { VideosComponent } from './pages/content/videos/videos.component';

export const routes: Routes = [
    {path: '',pathMatch: 'full', redirectTo: 'dashboard'},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'content', component: ContentComponent, children:[
        {path: 'video', component: VideosComponent, children:[
            {path: 'shorts', component: ShortsComponent}
        ]}
        
    ]},
    {path: 'analytics', component: AnalyticsComponent},
    {path: 'comments', component: CommentsComponent},
    {path: '**', redirectTo: 'dashboard'}
];  
