import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ModalConfig {
  type: 'confirmation' | 'success' | 'error';
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private modalSubject = new BehaviorSubject<ModalConfig | null>(null);
  modalState$: Observable<ModalConfig | null> = this.modalSubject.asObservable();

  showModal(config: ModalConfig): void {
    this.modalSubject.next(config);
  }

  closeModal(): void {
    this.modalSubject.next(null);
  }

  showSuccess(message: string): void {
    this.showModal({
      type: 'success',
      title: 'Succès',
      message,
      confirmText: 'OK',
      onConfirm: () => this.closeModal()
    });
  }

  showError(message: string): void {
    this.showModal({
      type: 'error',
      title: 'Erreur',
      message,
      confirmText: 'OK',
      onConfirm: () => this.closeModal()
    });
  }

  showConfirmation(title: string, message: string, onConfirm: () => void): void {
    this.showModal({
      type: 'confirmation',
      title,
      message,
      confirmText: 'Confirmer',
      cancelText: 'Annuler',
      onConfirm,
      onCancel: () => this.closeModal()
    });
  }
}