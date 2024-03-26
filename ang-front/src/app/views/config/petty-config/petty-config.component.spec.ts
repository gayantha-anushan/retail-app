import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PettyConfigComponent } from './petty-config.component';

describe('PettyConfigComponent', () => {
  let component: PettyConfigComponent;
  let fixture: ComponentFixture<PettyConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PettyConfigComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PettyConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
