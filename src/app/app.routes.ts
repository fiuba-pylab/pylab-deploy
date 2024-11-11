import { Routes } from '@angular/router';

export const routes: Routes = [
    { 
        path: '', 
        loadComponent: () => import('./layout/layout.component').then((m) => m.LayoutComponent),
        children: [
            { 
                path: '', 
                redirectTo: 'intro',
                pathMatch: 'full'
            },
            { 
                path: 'intro', 
                loadComponent: () => import('./pages/intro/intro.component').then((m) => m.IntroComponent)
            },
            { 
                path: 'home', 
                loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent)
            },
            {
                path: 'list/:type', 
                loadComponent: () => import('./pages/program-list/program-list.component').then((m) => m.ProgramListComponent)
            },
            {
                path: 'display/:type/:id', 
                loadComponent: () => import('./pages/program-display/program-display.component').then((m) => m.ProgramDisplayComponent)
            },
            {
                path: 'info/:id', 
                loadComponent: () => import('./pages/comments/comments.component').then((m) => m.CommentsComponent)
            }
        ]

    },
    { 
        path: '**',
        redirectTo: 'home'
    }
];

