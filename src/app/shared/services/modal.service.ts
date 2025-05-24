import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ModalConfig, ModalState } from '../modals/modal.types';

@Injectable({
    providedIn: 'root'
})
export class ModalService {
    private modals = new BehaviorSubject<ModalState[]>([]);
    modals$ = this.modals.asObservable();

    show(config: ModalConfig): string {
        const id = this.generateId();
        const modal: ModalState = {
            id,
            visible: true,
            type: config.type,
            message: config.message,
            title: config.title,
            timeout: config.timeout ?? 3000,
            showCloseButton: config.showCloseButton ?? true,
            position: config.position ?? 'top-right'
        };

        this.modals.next([...this.modals.value, modal]);

        if (modal.timeout && modal.timeout > 0) {
            setTimeout(() => this.hide(id), modal.timeout);
        }

        return id;
    }

    hide(id: string): void {
        this.modals.next(this.modals.value.filter(modal => modal.id !== id));
    }

    success(message: string, title?: string): string {
        return this.show({ type: 'success', message, title });
    }

    error(message: string, title?: string): string {
        return this.show({ type: 'error', message, title });
    }

    warning(message: string, title?: string): string {
        return this.show({ type: 'warning', message, title });
    }

    info(message: string, title?: string): string {
        return this.show({ type: 'info', message, title });
    }

    private generateId(): string {
        return Math.random().toString(36).substring(2, 9);
    }
} 