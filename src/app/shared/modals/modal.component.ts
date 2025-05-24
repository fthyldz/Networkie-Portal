import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { ModalState } from './modal.types';

@Component({
    selector: 'app-modal',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div 
            class="min-w-[320px] max-w-md rounded-lg shadow-lg p-4 transform transition-all duration-300"
            [class]="getTypeClasses()"
            [@fadeSlide]
        >
            <div class="flex items-start justify-between">
                <div class="flex items-center">
                    <i [class]="getIconClass()" class="text-xl mr-3"></i>
                    <div>
                        <h3 *ngIf="modal.title" class="font-semibold mb-1">{{ modal.title }}</h3>
                        <p class="text-sm">{{ modal.message }}</p>
                    </div>
                </div>
                
                <button 
                    *ngIf="modal.showCloseButton"
                    (click)="close.emit(modal.id)"
                    class="ml-4 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `,
    animations: [
        trigger('fadeSlide', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateX(100%)' }),
                animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
            ]),
            transition(':leave', [
                animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(100%)' }))
            ])
        ])
    ]
})
export class ModalComponent {
    @Input() modal!: ModalState;
    @Output() close = new EventEmitter<string>();

    getTypeClasses(): string {
        const classes = {
            success: 'bg-success/10 border-l-4 border-success text-success',
            error: 'bg-error/10 border-l-4 border-error text-error',
            warning: 'bg-warning/10 border-l-4 border-warning text-warning',
            info: 'bg-primary/10 border-l-4 border-primary text-primary'
        };
        return classes[this.modal.type];
    }

    getIconClass(): string {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        return icons[this.modal.type];
    }
} 