import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaefenComponent } from './haefen.component';

describe('HaefenComponent', () => {
  let component: HaefenComponent;
  let fixture: ComponentFixture<HaefenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HaefenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HaefenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
