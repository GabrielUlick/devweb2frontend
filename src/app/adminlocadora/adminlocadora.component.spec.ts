import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminlocadoraComponent } from './adminlocadora.component';

describe('AdminlocadoraComponent', () => {
  let component: AdminlocadoraComponent;
  let fixture: ComponentFixture<AdminlocadoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminlocadoraComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminlocadoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
