import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreiseComponent } from './preise.component';

describe('PreiseComponent', () => {
  let component: PreiseComponent;
  let fixture: ComponentFixture<PreiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreiseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
