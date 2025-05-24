import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-auth-layout',
    template: `
        <div class="min-h-screen bg-gradient-to-br from-primary-light via-white to-neutral-50 flex items-center justify-center p-4">
            <div class="w-full max-w-md">
                <div class="text-center mb-10">
                    <img src="assets/logo.png" alt="Logo" class="h-14 mx-auto mb-8" />
                </div>
                
                <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-neutral-100 p-8">
                    <router-outlet></router-outlet>
                </div>
                
                <div class="text-center mt-8 text-sm text-neutral-600">
                    <!--<p>Yardıma mı ihtiyacınız var? <a href="#" class="text-primary font-medium hover:text-primary-dark transition-colors">Bize ulaşın</a></p>-->
                </div>
            </div>
        </div>
    `,
    standalone: true,
    imports: [RouterOutlet, TranslateModule]
})
export class AuthLayoutComponent { }