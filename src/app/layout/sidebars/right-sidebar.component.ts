import { Component } from '@angular/core';

@Component({
    selector: 'app-right-sidebar',
    template: `
        <aside class="sticky top-20 space-y-4">
            <div class="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
                <h3 class="font-semibold mb-4">Önerilen Bağlantılar</h3>
                
                <div class="space-y-4">
                    <div class="group">
                        <div class="flex items-center gap-4">
                            <img src="assets/avatar-1.jpg" 
                                 alt="Öneri" 
                                 class="w-12 h-12 rounded-xl" />
                            <div class="flex-1 min-w-0">
                                <h4 class="font-medium truncate group-hover:text-primary transition-colors">İsim Soyisim</h4>
                                <p class="text-sm text-neutral-600 truncate">Senior Software Engineer at Tech Co.</p>
                            </div>
                            <button class="flex-shrink-0 h-9 px-4 rounded-full border border-primary text-primary hover:bg-primary hover:text-white font-medium transition-all">
                                <i class="fas fa-plus mr-2"></i>
                                Bağlan
                            </button>
                        </div>
                    </div>
                    
                    <div class="group">
                        <div class="flex items-center gap-4">
                            <img src="assets/avatar-2.jpg" 
                                 alt="Öneri" 
                                 class="w-12 h-12 rounded-xl" />
                            <div class="flex-1 min-w-0">
                                <h4 class="font-medium truncate group-hover:text-primary transition-colors">İsim Soyisim</h4>
                                <p class="text-sm text-neutral-600 truncate">Product Designer at Design Inc.</p>
                            </div>
                            <button class="flex-shrink-0 h-9 px-4 rounded-full border border-primary text-primary hover:bg-primary hover:text-white font-medium transition-all">
                                <i class="fas fa-plus mr-2"></i>
                                Bağlan
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
                <h3 class="font-semibold mb-4">Güncel Haberler</h3>
                <div class="space-y-4">
                    <a href="#" class="block group">
                        <div class="flex items-center gap-4">
                            <div class="w-16 h-16 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-400">
                                <i class="fas fa-newspaper text-xl"></i>
                            </div>
                            <div>
                                <h4 class="font-medium group-hover:text-primary transition-colors">Teknoloji Dünyasından Son Gelişmeler</h4>
                                <p class="text-sm text-neutral-600 mt-1">2 saat önce • 1,234 okuma</p>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </aside>
    `,
    standalone: true
})
export class RightSidebarComponent {} 