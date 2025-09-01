import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { PropertyService } from 'app/core/service/property/property.service';
import { NotificationService } from 'app/core/service/alert-service/notification.service';

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './property-form.component.html'
})
export class PropertyFormComponent implements OnInit {
  form: FormGroup;
  coverImagePreview: string | null = null;
  additionalImagesPreview: string[] = [];
  isSubmitting = false;
  isEditMode = false;
  propertyId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private propertyService: PropertyService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      address: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      type: ['VILLA', Validators.required],
      status: ['VENTE', Validators.required],
      coverImage: [null],
      images: [null]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.propertyId = +id;
        this.propertyService.getPropertyDetail(+id).subscribe({
          next: (property) => {
            this.form.patchValue({
              title: property.title,
              description: property.description,
              address: property.address,
              price: property.price,
              type: property.type,
              status: property.status
            });
            this.coverImagePreview = property.coverImageUrl ? `http://localhost:8080${property.coverImageUrl}` : null;
            this.additionalImagesPreview = property.images?.map(img => `http://localhost:8080${img}`) || [];
          },
          error: (err) => {
            this.notificationService.showError('Erreur lors du chargement de la propriété.');
          }
        });
      }
    });
  }

  onCoverImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) {
        this.notificationService.showError('Veuillez sélectionner une image valide.');
        return;
      }
      this.form.patchValue({ coverImage: file });
      const reader = new FileReader();
      reader.onload = () => (this.coverImagePreview = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  onAdditionalImagesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files).filter(file => file.type.startsWith('image/'));
      if (files.length !== input.files.length) {
        this.notificationService.showError('Certaines fichiers ne sont pas des images valides.');
      }
      this.form.patchValue({ images: files });
      this.additionalImagesPreview = [];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => this.additionalImagesPreview.push(reader.result as string);
        reader.readAsDataURL(file);
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.showError('Veuillez remplir tous les champs requis.');
      return;
    }

    this.isSubmitting = true;
    const formData = this.buildFormData();
    const request = this.isEditMode && this.propertyId
      ? this.propertyService.updateProperty(this.propertyId, formData)
      : this.propertyService.createProperty(formData);

    request.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.notificationService.showSuccess(
          this.isEditMode ? 'Propriété mise à jour avec succès !' : 'Propriété créée avec succès !'
        );
        this.form.reset({
          title: '',
          description: '',
          address: '',
          price: 0,
          type: 'VILLA',
          status: 'VENTE',
          coverImage: null,
          images: null
        });
        this.coverImagePreview = null;
        this.additionalImagesPreview = [];
        this.router.navigate(['/admin/properties-owner']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.notificationService.showError(err.message || 'Erreur lors de la soumission.');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/properties-owner']);
  }

  private buildFormData(): FormData {
    const formData = new FormData();
    const propertyDto = {
      title: this.form.get('title')?.value,
      description: this.form.get('description')?.value,
      address: this.form.get('address')?.value,
      price: this.form.get('price')?.value,
      type: this.form.get('type')?.value,
      status: this.form.get('status')?.value
    };
    formData.append('property', new Blob([JSON.stringify(propertyDto)], { type: 'application/json' }));
    const coverImage = this.form.get('coverImage')?.value;
    if (coverImage instanceof File) {
      formData.append('coverImage', coverImage);
    }
    const images = this.form.get('images')?.value || [];
    images.forEach((file: File) => formData.append('images', file));
    return formData;
  }
}