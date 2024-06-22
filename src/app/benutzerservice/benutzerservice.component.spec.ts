import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BenutzerService } from '../benutzerservice/benutzerservice.component';


describe('BenutzerserviceComponent', () => {
  let component: BenutzerService;
  let fixture: ComponentFixture<BenutzerService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BenutzerService]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BenutzerService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
