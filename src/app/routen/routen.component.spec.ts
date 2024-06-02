import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutenComponent } from './routen.component';

describe('RoutenComponent', () => {
  let component: RoutenComponent;
  let fixture: ComponentFixture<RoutenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoutenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
