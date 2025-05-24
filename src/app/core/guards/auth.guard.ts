import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

export const authGuard = () => {
    const router = inject(Router);
    const authService = inject(AuthService);

    return authService.isAuthenticated$.pipe(
        map(isAuthenticated => {
            if (isAuthenticated) {
                return true;
            }

            // Kullanıcı giriş yapmamışsa auth sayfasına yönlendir
            return router.createUrlTree(['/auth/login']);
        })
    );
};

export const publicGuard = () => {
    const router = inject(Router);
    const authService = inject(AuthService);

    return authService.isAuthenticated$.pipe(
        map(isAuthenticated => {
            if (!isAuthenticated) {
                return true;
            }

            // Kullanıcı zaten giriş yapmışsa ana sayfaya yönlendir
            return router.createUrlTree(['/']);
        })
    );
}; 