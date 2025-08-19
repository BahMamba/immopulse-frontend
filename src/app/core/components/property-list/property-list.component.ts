import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime, Subject } from 'rxjs';
import { PropertyListItem, PaginatedProperties } from '../../property.models';
import { PropertyService } from '../../service/property/property.service';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.css']
})
export class PropertyListComponent implements OnInit {
  properties: PropertyListItem[] = [];
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 5;
  errorMessage = '';
  loading = false;
  searchTerm = '';
  status = '';
  statusOptions = [
    { label: 'Tous', value: '' },
    { label: 'Disponible', value: 'DISPONIBLE' },
    { label: 'En vente', value: 'VENTE' },
    { label: 'Location', value: 'LOUER' }
  ];

  private searchSubject = new Subject<string>();

  constructor(private service: PropertyService) {}

  ngOnInit(): void {
    this.setupSearchDebounce();
    this.getProperties();
  }

  setupSearchDebounce(): void {
    this.searchSubject.pipe(debounceTime(300)).subscribe(searchTerm => {
      this.searchTerm = searchTerm;
      this.currentPage = 0;
      this.getProperties();
    });
  }

  onSearchChange(searchTerm: string): void {
    this.searchSubject.next(searchTerm);
  }

  onStatusChange(): void {
    this.currentPage = 0;
    this.getProperties();
  }

  getProperties(): void {
    this.loading = true;
    this.service.getProperties(this.currentPage, this.pageSize, this.searchTerm, this.status).subscribe({
      next: (data: PaginatedProperties<PropertyListItem>) => {
        this.properties = data.content;
        this.totalPages = data.totalPages;
        this.loading = false;
        this.errorMessage = this.properties.length === 0 ? 'Aucune propriété trouvée pour ces critères' : '';
      },
      error: err => {
        this.errorMessage = err.message;
        this.loading = false;
      }
    });
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.getProperties();
    }
  }

  getStatusLabel(status: string): string {
    return this.statusOptions.find(opt => opt.value === status)?.label || status;
  }
}