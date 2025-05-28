import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { LoadingService } from '../../shared/services/loading.service';

@Component({
    selector: 'app-navbar',
    template: `
        <nav class="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-neutral-200 z-50">
            <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <div class="flex items-center gap-6">
                    <img src="assets/logo.png" alt="Logo" class="h-8 cursor-pointer" (click)="goTo('dashboard')" />
                    <div class="hidden md:flex gap-4 ml-8" *ngIf="isManager">
                        <button class="text-sm font-medium text-neutral-700 hover:text-primary transition cursor-pointer" (click)="goTo('users')">Kullanıcılar</button>
                        <button class="text-sm font-medium text-neutral-700 hover:text-primary transition cursor-pointer" (click)="goTo('universities')">Üniversiteler</button>
                        <button class="text-sm font-medium text-neutral-700 hover:text-primary transition cursor-pointer" (click)="goTo('departments')">Bölümler</button>
                        <button class="text-sm font-medium text-neutral-700 hover:text-primary transition cursor-pointer" (click)="goTo('professions')">Meslekler</button>
                        <button class="text-sm font-medium text-neutral-700 hover:text-primary transition cursor-pointer" (click)="goTo('social-platforms')">Sosyal Platformlar</button>
                        <button class="text-sm font-medium text-neutral-700 hover:text-primary transition cursor-pointer" (click)="goTo('map-info')">Harita Bilgileri</button>
                    </div>
                </div>
                
                <div class="relative" (mouseleave)="closeMenu()">
                    <button (click)="toggleMenu()" class="relative w-10 h-10 rounded-full overflow-hidden hover:ring-2 hover:ring-primary/20 transition-all">
                        <img src="assets/avatar.jpg" alt="Profil" class="w-full h-full object-cover" />
                    </button>
                    <div *ngIf="menuOpen" class="absolute right-0 top-10 w-40 bg-white border border-gray-200 rounded-lg shadow-md z-50">
                        <button (click)="goToProfile()" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition">
                            <i class="fas fa-user mr-2"></i> Profil
                        </button>
                        <button (click)="logout()" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition">
                            <i class="fas fa-sign-out-alt mr-2"></i> Çıkış Yap
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    `,
    standalone: true,
    imports: [CommonModule/*RouterLink, RouterLinkActive*/]
})
export class NavbarComponent {
    menuOpen = false;
    isManager: boolean = false;

    constructor(
        private eRef: ElementRef,
        private authService: AuthService,
        private router: Router,
        private loadingService: LoadingService
    ) {
        this.isManager = JSON.parse(localStorage.getItem("isManager") as string)
    }

    toggleMenu() {
        this.menuOpen = !this.menuOpen;
    }

    closeMenu() {
        this.menuOpen = false;
    }

    @HostListener('document:click', ['$event'])
    clickOutside(event: Event) {
        if (!this.eRef.nativeElement.contains(event.target)) {
            this.menuOpen = false;
        }
    }

    goToProfile() {
        this.router.navigate(['/profile']);
    }

    logout() {
        this.loadingService.show('', 0.5);
        this.authService.logout();
        this.router.navigate(['/auth', 'login']);
    }

    goTo(page: string) {
        switch (page) {
            case 'dashboard':
                this.router.navigate(['/dashboard']);
                break;
            case 'users':
                this.router.navigate(['/admin', 'users']);
                break;
            case 'universities':
                this.router.navigate(['/admin', 'universities']);
                break;
            case 'departments':
                this.router.navigate(['/admin', 'departments']);
                break;
            case 'professions':
                this.router.navigate(['/admin', 'professions']);
                break;
            case 'social-platforms':
                this.router.navigate(['/admin', 'social-platforms']);
                break;
            case 'map-info':
                this.router.navigate(['/admin', 'map-info']);
                break;
        }
    }
}