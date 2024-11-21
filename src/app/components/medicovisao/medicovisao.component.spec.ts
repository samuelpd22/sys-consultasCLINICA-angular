import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicovisaoComponent } from './medicovisao.component';

describe('MedicovisaoComponent', () => {
  let component: MedicovisaoComponent;
  let fixture: ComponentFixture<MedicovisaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicovisaoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MedicovisaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
