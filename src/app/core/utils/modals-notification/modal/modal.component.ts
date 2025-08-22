import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, ModalConfig } from 'app/core/service/alert-service/notification.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html'
})
export class ModalComponent {
  modalConfig: ModalConfig | null = null;

  constructor(public notificationService: NotificationService) {
    this.notificationService.modalState$.subscribe(config => {
      this.modalConfig = config;
    });
  }
}