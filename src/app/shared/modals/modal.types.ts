export type ModalType = 'info' | 'error' | 'success' | 'warning';

export interface ModalConfig {
    title?: string;
    message: string;
    type: ModalType;
    timeout?: number;
    showCloseButton?: boolean;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';
}

export interface ModalState extends ModalConfig {
    id: string;
    visible: boolean;
} 