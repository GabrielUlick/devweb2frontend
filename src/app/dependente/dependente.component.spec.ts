import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DependenteComponent } from './dependente.component';

describe('DependenteComponent', () => {
  let component: DependenteComponent;
  let fixture: ComponentFixture<DependenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DependenteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DependenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
