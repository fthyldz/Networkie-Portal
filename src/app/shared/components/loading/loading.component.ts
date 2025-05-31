import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isLoading" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div class="bg-white rounded-2xl px-8 py-6 shadow-lg flex flex-col items-center space-y-4 border border-gray-200">
        <div class="relative w-14 h-14 flex items-center justify-center">
          <svg class="animate-spin w-12 h-12 text-primary" viewBox="0 0 50 50">
            <circle class="opacity-30" cx="25" cy="25" r="20" stroke="currentColor" stroke-width="5" fill="none"/>
            <circle class="opacity-90" cx="25" cy="25" r="20" stroke="currentColor" stroke-width="5" fill="none" stroke-linecap="round" stroke-dasharray="90" stroke-dashoffset="60"/>
          </svg>
        </div>
        <div class="text-base text-gray-700 font-medium">{{ message || 'Yükleniyor...' }}</div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes spin-slow {
      100% { transform: rotate(360deg); }
    }
    .animate-spin-slow {
      animation: spin-slow 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }
  `]
})
export class LoadingComponent {
  @Input() isLoading: boolean = false;
  @Input() message: string = '';
}