import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramInput } from './program-input.component';

describe('ProgramInput', () => {
  let component: ProgramInput;
  let fixture: ComponentFixture<ProgramInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramInput]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProgramInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
