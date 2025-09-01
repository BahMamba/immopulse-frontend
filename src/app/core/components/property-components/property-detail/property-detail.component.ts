import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PropertyService } from 'app/core/service/property/property.service';
import { PropertyDetail } from 'app/core/property.models';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PropertyDetailComponent implements OnInit {
  propertyDetail: PropertyDetail | null = null;
  loading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private service: PropertyService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPropertyDetail(+id);
    }
  }

  loadPropertyDetail(id: number): void {
    this.loading = true;
    this.service.getPropertyDetail(id).subscribe({
      next: (data: PropertyDetail) => {
        this.propertyDetail = data;
        this.loading = false;
        this.errorMessage = '';
      },
      error: (err: any) => {
        this.errorMessage = err.message || 'Erreur lors du chargement des détails';
        this.loading = false;
      }
    });
  }

  get hasImages(): boolean {
    return !!this.propertyDetail?.images?.length;
  }

  getStatusLabel(status: string): string {
    const statusOptions = [
      { label: 'Tous', value: '' },
      { label: 'Disponible', value: 'DISPONIBLE' },
      { label: 'En vente', value: 'VENTE' },
      { label: 'Location', value: 'LOUER' }
    ];
    return statusOptions.find(opt => opt.value === status)?.label || status;
  }
}