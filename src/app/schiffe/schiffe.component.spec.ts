import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchiffeComponent } from './schiffe.component';

describe('SchiffeComponent', () => {
  let component: SchiffeComponent;
  let fixture: ComponentFixture<SchiffeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchiffeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SchiffeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
