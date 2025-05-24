import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';

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
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.uniqueCode = params['uniqueCode'];
        });
    }

    resendEmail(): void {
        console.log('Doğrulama email\'i tekrar gönderiliyor...');
        this.authService.resendEmailVerificationCode(this.uniqueCode).subscribe({
            next: (response) => {
                console.log('Doğrulama email\'i başarıyla gönderildi:', response);
                this.authService.removeToken();
                this.router.navigate(['/auth', 'login']);
            },
            error: (error) => {
                console.error('Doğrulama email\'i gönderilirken hata oluştu:', error);
            }
        });
    }
}