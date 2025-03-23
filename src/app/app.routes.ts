import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';

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
    { path: '**', redirectTo: 'auth' }
];
