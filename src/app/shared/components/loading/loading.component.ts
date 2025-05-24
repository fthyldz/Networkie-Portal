import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isLoading" class="fixed inset-0 bg-gradient-to-br from-primary/60 to-secondary/60 backdrop-blur-md z-50 flex items-center justify-center">
      <div class="bg-white/90 rounded-xl px-10 py-8 shadow-2xl flex flex-col items-center space-y-6 border border-primary/10">
        <div class="relative w-16 h-16 flex items-center justify-center">
          <svg class="animate-spin-slow w-14 h-14 text-primary" viewBox="0 0 50 50">
            <circle class="opacity-20" cx="25" cy="25" r="20" stroke="currentColor" stroke-width="6" fill="none"/>
            <circle class="opacity-80" cx="25" cy="25" r="20" stroke="currentColor" stroke-width="6" fill="none" stroke-linecap="round" stroke-dasharray="90" stroke-dashoffset="60"/>
          </svg>
        </div>
        <div class="text-lg text-primary font-semibold tracking-wide">{{ message || 'Yükleniyor...' }}</div>
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