import { Component } from '@angular/core';

@Component({
    selector: 'app-left-sidebar',
    template: `
        <aside class="sticky top-20 space-y-4">
            <div class="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
                <div class="relative">
                    <div class="h-24 bg-gradient-to-r from-primary to-primary-dark"></div>
                    <div class="px-6 pb-6">
                        <div class="relative -mt-12">
                            <img src="assets/avatar.jpg" 
                                 alt="Profil" 
                                 class="w-20 h-20 rounded-2xl border-4 border-white shadow-sm" />
                        </div>
                        <h3 class="text-lg font-semibold mt-3">Kullanıcı Adı</h3>
                        <p class="text-neutral-600">Ünvan</p>
                    </div>
                </div>
                
                <div class="border-t border-neutral-100">
                    <div class="divide-y divide-neutral-100">
                        <a href="#" class="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors">
                            <div>
                                <span class="text-neutral-600 text-sm">Profil görüntülenme</span>
                                <p class="font-semibold text-primary mt-1">123 yeni görüntüleme</p>
                            </div>
                            <i class="fas fa-chart-line text-neutral-400"></i>
                        </a>
                        <a href="#" class="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors">
                            <div>
                                <span class="text-neutral-600 text-sm">Bağlantılarınız</span>
                                <p class="font-semibold text-primary mt-1">1,234 profesyonel</p>
                            </div>
                            <i class="fas fa-user-group text-neutral-400"></i>
                        </a>
                    </div>
                </div>
            </div>
            
            <div class="bg-white rounded-2xl shadow-sm border border-neutral-100 p-4">
                <h3 class="font-medium text-sm text-neutral-600 mb-3">Kısayollar</h3>
                <div class="space-y-2">
                    <a href="#" class="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 transition-colors">
                        <i class="fas fa-bookmark text-primary"></i>
                        <span class="text-sm font-medium">Kaydedilenler</span>
                    </a>
                    <a href="#" class="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 transition-colors">
                        <i class="fas fa-calendar text-primary"></i>
                        <span class="text-sm font-medium">Etkinlikler</span>
                    </a>
                </div>
            </div>
        </aside>
    `,
    standalone: true
})
export class LeftSidebarComponent {} 