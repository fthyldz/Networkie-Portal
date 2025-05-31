import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { LoginDto } from '../../../shared/models/auth/login.model';
import { ModalService } from '../../../shared/services/modal.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '../../../shared/services/loading.service';

@Component({
    selector: 'app-login',
    standalone: false,
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
    verificationCode: string | null = null;
    loginForm!: FormGroup;
    isEmailVerified: boolean = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private modalService: ModalService,
        private translateService: TranslateService,
        private route: ActivatedRoute,
        private router: Router,
        private loadingService: LoadingService
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.verificationCode = params['verificationCode'] || null;
            if (this.verificationCode) {
                this.authService.logout();
                this.verifyEmail();
            }
        });

        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]]
        });
    }

    verifyEmail(): void {
        if (this.verificationCode) {
            this.authService.verifyEmail(this.verificationCode).subscribe({
                next: () => {
                    this.isEmailVerified = true;
                    this.modalService.success('Email adresiniz başarıyla onaylandı. Giriş yaparak devam edebilirsiniz.');
                },
                error: (error) => {
                    this.modalService.error('Email doğrulama işlemi başarısız oldu.');
                }
            });
        }
    }

    onSubmit(): void {
        if (this.loginForm.valid) {
            this.loadingService.show();
            const { email, password } = this.loginForm.value;
            const data: LoginDto = {
                email,
                password
            };
            this.authService.login(data).subscribe({
                next: (response) => {
                    this.loadingService.hide();
                    if (response.data) {
                        this.modalService.success('Giriş başarılı');
                        // localStorage.setItem('isProfileCompleted', response.data.isProfileCompleted ?? false);

                        // if (response.data.isProfileCompleted)
                        this.router.navigate(['/dashboard']);
                        // else
                        //     this.router.navigate(['/auth', 'complete-profile']);
                    } else {
                        this.modalService.error('Giriş başarısız');
                    }
                },
                error: (error) => {
                    this.modalService.error('Email veya Şifre Hatalı!');
                    this.loadingService.hide();
                },
                complete: () => {
                    this.loadingService.hide();
                }
            });
        }
    }
}