import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime, Subject } from 'rxjs';
import { PaginatedProperties, PropertyListItem } from '../../../property.models';
import { PropertyService } from 'app/core/service/property/property.service';
import { NotificationService } from 'app/core/service/alert-service/notification.service';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './property-list.component.html'
})
export class PropertyListComponent implements OnInit {
  properties: PropertyListItem[] = [];
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 6;
  isLoading = false;
  titleFilter = '';
  statusFilter = '';
  private searchSubject = new Subject<string>();

  constructor(
    private service: PropertyService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.setupSearchDebounce();
    this.loadProperties();
  }

  setupSearchDebounce(): void {
    this.searchSubject.pipe(debounceTime(300)).subscribe(searchTerm => {
      this.titleFilter = searchTerm;
      this.currentPage = 0;
      this.loadProperties();
    });
  }

  onSearchChange(searchTerm: string): void {
    this.searchSubject.next(searchTerm);
  }

  onStatusChange(): void {
    this.currentPage = 0;
    this.loadProperties();
  }

  loadProperties(): void {
    this.isLoading = true;
    this.service.getProperties(this.currentPage, this.pageSize, this.titleFilter, this.statusFilter).subscribe({
      next: (data: PaginatedProperties<PropertyListItem>) => {
        this.properties = data.content;
        this.totalPages = data.totalPages;
        this.isLoading = false;
        if (this.properties.length === 0 && this.currentPage === 0) {
          this.notificationService.showError('Aucune propriété trouvée pour ces critères.');
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
}