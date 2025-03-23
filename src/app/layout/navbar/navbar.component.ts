import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-navbar',
    template: `
        <nav class="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-neutral-200 z-50">
            <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <div class="flex items-center gap-6">
                    <img src="assets/logo.png" alt="Logo" class="h-8" />
                    <div class="relative group">
                        <input 
                            type="search" 
                            placeholder="Kişi, iş ilanı veya içerik ara..."
                            class="w-80 h-10 bg-neutral-50 rounded-full pl-12 pr-4 border border-transparent focus:border-primary focus:outline-none focus:bg-white transition-all"
                        >
                        <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors"></i>
                    </div>
                </div>
                
                <div class="flex items-center">
                    <nav class="flex items-center">
                        <a routerLink="/home" 
                           routerLinkActive="text-primary border-primary"
                           class="px-5 h-16 flex items-center gap-2 text-neutral-600 hover:text-primary border-b-2 border-transparent transition-colors">
                            <i class="fas fa-home text-xl"></i>
                            <span class="text-sm font-medium">Ana Sayfa</span>
                        </a>
                        <a routerLink="/network" 
                           routerLinkActive="text-primary border-primary"
                           class="px-5 h-16 flex items-center gap-2 text-neutral-600 hover:text-primary border-b-2 border-transparent transition-colors">
                            <i class="fas fa-users text-xl"></i>
                            <span class="text-sm font-medium">Ağım</span>
                        </a>
                        <a routerLink="/jobs" 
                           routerLinkActive="text-primary border-primary"
                           class="px-5 h-16 flex items-center gap-2 text-neutral-600 hover:text-primary border-b-2 border-transparent transition-colors">
                            <i class="fas fa-briefcase text-xl"></i>
                            <span class="text-sm font-medium">İş İlanları</span>
                        </a>
                        
                        <div class="flex items-center pl-4 ml-4 border-l border-neutral-200">
                            <button class="relative w-10 h-10 rounded-full overflow-hidden hover:ring-2 hover:ring-primary/20 transition-all">
                                <img src="assets/avatar.jpg" alt="Profil" class="w-full h-full object-cover" />
                                <span class="absolute top-0 right-0 w-3 h-3 bg-primary border-2 border-white rounded-full"></span>
                            </button>
                        </div>
                    </nav>
                </div>
            </div>
        </nav>
    `,
    standalone: true,
    imports: [RouterLink, RouterLinkActive]
})
export class NavbarComponent {}