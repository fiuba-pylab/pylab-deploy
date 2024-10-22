import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramDisplayComponent } from './program-display.component';

describe('ProgramDisplayComponent', () => {
  let component: ProgramDisplayComponent;
  let fixture: ComponentFixture<ProgramDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramDisplayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProgramDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
