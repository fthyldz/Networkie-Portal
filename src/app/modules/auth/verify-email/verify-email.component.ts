import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { LoadingService } from '../../../shared/services/loading.service';

@Component({
    selector: 'app-verify-email',
    standalone: false,
    templateUrl: './verify-email.component.html'
})
export class VerifyEmailComponent {
    uniqueCode: string = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private loadingService: LoadingService
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.uniqueCode = params['uniqueCode'];
        });
    }

    resendEmail(): void {
        this.loadingService.show();
        console.log('Doğrulama email\'i tekrar gönderiliyor...');
        this.authService.resendEmailVerificationCode(this.uniqueCode).subscribe({
            next: (response) => {
                this.loadingService.hide();
                console.log('Doğrulama email\'i başarıyla gönderildi:', response);
                this.authService.removeToken();
                this.router.navigate(['/auth', 'login']);
            },
            error: (error) => {
                this.loadingService.hide();
                console.error('Doğrulama email\'i gönderilirken hata oluştu:', error);
            }
        });
    }
}