import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ModalService } from '../../../shared/services/modal.service';
import { Router } from '@angular/router';
import { LoadingService } from '../../../shared/services/loading.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private modalService: ModalService,
    private router: Router,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      terms: [false, Validators.requiredTrue]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loadingService.show();
      const formData = this.registerForm.value;
      this.authService.register(formData).subscribe({
        next: (response) => {
          this.loadingService.hide();
          this.modalService.success('Kayıt işlemi başarılı. Lütfen email adresinizi onaylayın.');
          this.router.navigate(['/auth/verify-email', response.data]);
        },
        error: (error) => {
          this.loadingService.hide();
          this.modalService.error('Kayıt işlemi sırasında bir hata oluştu.');
        }
      });
    }
  }

  showTermsModal = false;

  openTermsModal(event: Event): void {
    event.preventDefault();
    this.showTermsModal = true;
  }

  closeTermsModal(): void {
    this.showTermsModal = false;
  }
}