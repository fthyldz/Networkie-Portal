import { Component } from '@angular/core';

@Component({
    selector: 'app-verify-email',
    standalone: false,
    templateUrl: './verify-email.component.html'
})
export class VerifyEmailComponent {
    resendEmail(): void {
        console.log('Doğrulama email\'i tekrar gönderiliyor...');
        // Burada API çağrısı yapılabilir.
    }
}