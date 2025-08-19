import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { PropertyService } from '../../service/property/property.service';

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
  errorMessage = '';
  isEditMode = false;
  propertyId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private propertyService: PropertyService,
    private router: Router,
    private route: ActivatedRoute
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
            this.coverImagePreview = property.coverImageUrl || null;
            this.additionalImagesPreview = property.images || [];
          },
          error: () => (this.errorMessage = 'Erreur lors du chargement')
        });
      }
    });
  }

  // ajout de l'image de couverture
  onCoverImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      const file = input.files[0];
      this.form.patchValue({ coverImage: file });
      const reader = new FileReader();
      reader.onload = () => setTimeout(() => (this.coverImagePreview = reader.result as string), 0);
      reader.readAsDataURL(file);
    }
  }

  // ajout de plusieurs images
  onAdditionalImagesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      this.form.patchValue({ images: files });
      this.additionalImagesPreview = [];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => setTimeout(() => this.additionalImagesPreview.push(reader.result as string), 0);
        reader.readAsDataURL(file);
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
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
        this.router.navigate(['/admin/properties']);
      },
      error: (err) => {
        this.errorMessage = err.message || 'Erreur lors de la soumission';
        this.isSubmitting = false;
      }
    });
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
    if (coverImage instanceof File) formData.append('coverImage', coverImage);
    const images = this.form.get('images')?.value || [];
    images.forEach((file: File) => formData.append('images', file));
    return formData;
  }
}