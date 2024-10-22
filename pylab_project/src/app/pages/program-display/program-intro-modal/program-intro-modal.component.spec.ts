import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramIntroModalComponent } from './program-intro-modal.component';

describe('ProgramIntroModalComponent', () => {
  let component: ProgramIntroModalComponent;
  let fixture: ComponentFixture<ProgramIntroModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramIntroModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProgramIntroModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
