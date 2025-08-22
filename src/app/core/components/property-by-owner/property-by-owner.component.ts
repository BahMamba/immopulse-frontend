// src/app/components/property-by-owner/property-by-owner.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginatedProperties, PropertyListItem } from '../../property.models';
import { PropertyService } from '../../service/property/property.service';
import { NotificationService } from 'app/core/service/alert-service/notification.service';

@Component({
  selector: 'app-property-by-owner',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './property-by-owner.component.html'
})
export class PropertyByOwnerComponent implements OnInit {
  properties: PropertyListItem[] = [];
  currentPage = 0;
  pageSize = 6;
  totalPages = 0;
  isLoading = false;
  titleFilter = '';
  statusFilter = '';

  constructor(
    private service: PropertyService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {
    this.isLoading = true;
    this.service.getPropertiesByOwner(this.currentPage, this.pageSize, this.titleFilter, this.statusFilter).subscribe({
      next: (data: PaginatedProperties<PropertyListItem>) => {
        this.properties = data.content;
        this.totalPages = data.totalPages;
        this.isLoading = false;
        if (this.properties.length === 0 && this.currentPage === 0) {
          this.notificationService.showSuccess('Aucune propriété pour le moment. Ajoutez-en une !');
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.notificationService.showError(err.message);
      }
    });
  }

  managePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadProperties();
    }
  }

  deleteProperty(id: number): void {
    this.notificationService.showConfirmation(
      'Confirmer la suppression',
      'Voulez-vous vraiment supprimer cette propriété ?',
      () => {
        this.service.deleteProperty(id).subscribe({
          next: () => {
            this.notificationService.showSuccess('Propriété supprimée avec succès !');
            this.loadProperties();
          },
          error: (err) => {
            this.notificationService.showError(err.message);
          }
        });
      }
    );
  }
}