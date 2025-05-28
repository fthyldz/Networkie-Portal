import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { authGuard, publicGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'auth',
        component: AuthLayoutComponent,
        children: [
            {
                path: '',
                loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
            }
        ]
    },
    {
        path: 'admin',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule)
            }
        ]
    },
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                loadChildren: () => import('./modules/main/main.module').then(m => m.MainModule)
            }
        ]
        /*children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./modules/main/dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            {
                path: 'profile',
                loadComponent: () => import('./modules/profile/profile.component').then(m => m.ProfileComponent)
            },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]*/
    },
    { path: '**', redirectTo: '' }
];
