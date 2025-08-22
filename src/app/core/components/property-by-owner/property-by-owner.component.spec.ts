import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyByOwnerComponent } from './property-by-owner.component';

describe('PropertyByOwnerComponent', () => {
  let component: PropertyByOwnerComponent;
  let fixture: ComponentFixture<PropertyByOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyByOwnerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyByOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
