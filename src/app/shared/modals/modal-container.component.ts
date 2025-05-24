import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../services/modal.service';
import { ModalComponent } from './modal.component';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-modal-container',
    standalone: true,
    imports: [CommonModule, ModalComponent],
    template: `
        <div class="fixed inset-0 pointer-events-none z-9999">
            <div *ngFor="let position of positions" [class]="getPositionClass(position)">
                <app-modal
                    *ngFor="let modal of getModalsByPosition(position) | async"
                    [modal]="modal"
                    (close)="onClose($event)"
                    class="pointer-events-auto mb-2 last:mb-0"
                ></app-modal>
            </div>
        </div>
    `
})
export class ModalContainerComponent {
    positions = ['top-right', 'top-left', 'bottom-right', 'bottom-left', 'center'] as const;
    modals$;

    constructor(private modalService: ModalService) {
        this.modals$ = modalService.modals$;
    }

    getModalsByPosition(position: string) {
        return this.modals$.pipe(
            map(modals => modals.filter(modal => modal.position === position))
        );
    }

    getPositionClass(position: string): string {
        const classes = {
            'top-right': 'fixed top-4 right-4 flex flex-col items-end',
            'top-left': 'fixed top-4 left-4 flex flex-col items-start',
            'bottom-right': 'fixed bottom-4 right-4 flex flex-col items-end',
            'bottom-left': 'fixed bottom-4 left-4 flex flex-col items-start',
            'center': 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center'
        };
        return classes[position as keyof typeof classes] || classes['top-right'];
    }

    onClose(id: string): void {
        this.modalService.hide(id);
    }
} 