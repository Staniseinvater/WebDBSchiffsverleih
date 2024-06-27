import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BookingFormDialogComponent } from '../booking-form-dialog/booking-form-dialog.component'; // Ensure the path is correct
import { ReactiveFormsModule } from '@angular/forms';
import { BenutzerService } from '../benutzerservice/benutzerservice.component';


interface Schiff {
  name: string;
  type: string;
  capacity: number;
  preisProNacht: number;
  inhalt: string;
  bildUrls: string[];
  hafenId: number;
}

interface Hafen {
  id: number;
  name: string;
  lat: number;
  lon: number;
  schiffe?: Schiff[];
}

@Component({
  selector: 'app-schiffe',
  standalone: true,
  templateUrl: './schiffe.component.html',
  styleUrls: ['./schiffe.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDialogModule
  ]
})

export class SchiffeComponent {
  hafens: Hafen[] = [
    {
      id: 1, name: 'Hamburg', lat: 53.5511, lon: 9.9937, schiffe: [
        {
          name: 'Schiff 1',
          type: 'Yacht',
          capacity: 10,
          preisProNacht: 200,
          inhalt: 'Luxus-Kabinen, Pool, Bar',
          bildUrls: ['assets/Boot 1 (2).png', 'assets/Boot 1 (1).png',    'assets/Boot 1 (3).png','assets/Boot 1 (4).png','assets/Boot 1 (5).png',  ],
          hafenId: 1
        },
        {
          name: 'Schiff 2',
          type: 'Segelboot',
          capacity: 8,
          preisProNacht: 150,
          inhalt: 'Kabinen, Küche, Deck',
          bildUrls: ['assets/Boot 3 (2).png', 'assets/Boot 3 (1).png','assets/Boot 3 (3).png','assets/Boot 3 (4).png',],
          hafenId: 1
        },
        {
          name: 'Schiff 3',
          type: 'Segelboot',
          capacity: 8,
          preisProNacht: 150,
          inhalt: 'Kabinen, Küche, Deck',
          bildUrls: ['assets/Boot 2 (2).png', 'assets/Boot 2 (1).png', 'assets/Boot 2 (3).png', 'assets/Boot 2 (4).png', 'assets/Boot 2 (5).png'],
          hafenId: 1
        },
        {
          name: 'Schiff 4',
          type: 'Segelboot',
          capacity: 890,
          preisProNacht: 150,
          inhalt: 'Kabinen, Küche, Deck',
          bildUrls: ['assets/Boot 4 (2).png', 'assets/Boot 4 (1).png','assets/Boot 4 (3).png','assets/Boot 4 (4).png','assets/Boot 4 (5).png',],
          hafenId: 1
        },
        {
          name: 'Schiff 5',
          type: 'Segelboot',
          capacity: 8,
          preisProNacht: 150,
          inhalt: 'Kabinen, Küche, Deck',
          bildUrls: ['assets/Boot 5 (1).png', 'assets/Boot 4 (2).png','assets/Boot 5 (3).png','assets/Boot 5 (4).png','assets/Boot 5 (5).png', ],
          hafenId: 1
        }
      ]
    },
    {
      id: 2, name: 'Rotterdam', lat: 51.9225, lon: 4.47917, schiffe: [
        {
          name: 'Schiff 6',
          type: 'Kreuzfahrtschiff',
          capacity: 300,
          preisProNacht: 400,
          inhalt: 'Restaurants, Kino, Fitnessstudio',
          bildUrls: ['assets/Boot 6 (1).png', 'assets/Boot 6 (2).png','assets/Boot 6 (3).png','assets/Boot 6 (4).png','assets/Boot 6 (5).png',],
          hafenId: 2
        },
        {
          name: 'Schiff 7',
          type: 'Kreuzfahrtschiff',
          capacity: 300,
          preisProNacht: 400,
          inhalt: 'Restaurants, Kino, Fitnessstudio',
          bildUrls: ['assets/Boot 7 (2).png', 'assets/Boot 7 (1).png','assets/Boot 7 (3).png', 'assets/Boot 7 (4).png','assets/Boot 7 (5).png', 'assets/Boot 7 (6).png',],
          hafenId: 2
        },
        {
          name: 'Schiff 8',
          type: 'Kreuzfahrtschiff',
          capacity: 300,
          preisProNacht: 400,
          inhalt: 'Restaurants, Kino, Fitnessstudio',
          bildUrls: ['assets/Boot 1 (2).png', 'assets/Boot 1 (1).png'],
          hafenId: 2
        }
      ]
    },
    {
      id: 3, name: 'Port Hercule', lat: 43.7333, lon: 7.4200, schiffe: [
        {
          name: 'Schiff 9',
          type: 'Luxusyacht',
          capacity: 20,
          preisProNacht: 1000,
          inhalt: 'Luxus-Kabinen, Pool, Bar, Kino',
          bildUrls: ['assets/Boot 1 (2).png', 'assets/Boot 1 (1).png'],
          hafenId: 3
        },
        {
          name: 'Schiff 10',
          type: 'Luxusyacht',
          capacity: 20,
          preisProNacht: 1000,
          inhalt: 'Luxus-Kabinen, Pool, Bar, Kino',
          bildUrls: ['assets/Boot 1 (2).png', 'assets/Boot 1 (1).png'],
          hafenId: 3
        },
        {
          name: 'Schiff 11',
          type: 'Luxusyacht',
          capacity: 20,
          preisProNacht: 1000,
          inhalt: 'Luxus-Kabinen, Pool, Bar, Kino',
          bildUrls: ['assets/Boot 1 (2).png', 'assets/Boot 1 (1).png'],
          hafenId: 3
        }
      ]
    },
    {
      id: 4, name: 'Marina di Prtofino', lat: 44.3038, lon: 9.2101, schiffe: [
        {
          name: 'Schiff 12',
          type: 'Luxusyacht',
          capacity: 20,
          preisProNacht: 1000,
          inhalt: 'Luxus-Kabinen, Pool, Bar, Kino',
          bildUrls: ['assets/Boot 1 (2).png', 'assets/Boot 1 (1).png'],
          hafenId: 4
        },
        {
          name: 'Schiff 13',
          type: 'Luxusyacht',
          capacity: 20,
          preisProNacht: 1000,
          inhalt: 'Luxus-Kabinen, Pool, Bar, Kino',
          bildUrls: ['assets/Boot 1 (2).png', 'assets/Boot 1 (1).png'],
          hafenId: 4
        },
        {
          name: 'Schiff 14',
          type: 'Luxusyacht',
          capacity: 20,
          preisProNacht: 1000,
          inhalt: 'Luxus-Kabinen, Pool, Bar, Kino',
          bildUrls: ['assets/Boot 1 (2).png', 'assets/Boot 1 (1).png'],
          hafenId: 4
        }
      ]
    }, {
      id: 5, name: 'Puerto Banús', lat: 36.4874, lon: -4.9526, schiffe: [

        {
          name: 'Schiff 15',
          type: 'Luxusyacht',
          capacity: 20,
          preisProNacht: 1000,
          inhalt: 'Luxus-Kabinen, Pool, Bar, Kino',
          bildUrls: ['assets/Boot 1 (2).png', 'assets/Boot 1 (1).png'],
          hafenId: 5
        }
      ]
    }, 
    {
      id: 6, name: 'Port Vauban', lat: 43.5804, lon: 7.1282, schiffe: [

        {
          name: 'Schiff 15',
          type: 'Luxusyacht',
          capacity: 20,
          preisProNacht: 1000,
          inhalt: 'Luxus-Kabinen, Pool, Bar, Kino',
          bildUrls: ['assets/Boot 1 (2).png', 'assets/Boot 1 (1).png'],
          hafenId: 6
        }
      ]
    }, 
    {
      id: 7, name: 'Marina del Rey', lat: 33.9777, lon: -118.4351, schiffe: [

        {
          name: 'Schiff 15',
          type: 'Luxusyacht',
          capacity: 20,
          preisProNacht: 1000,
          inhalt: 'Luxus-Kabinen, Pool, Bar, Kino',
          bildUrls: ['assets/Boot 1 (2).png', 'assets/Boot 1 (1).png'],
          hafenId: 7
        }
      ]
    }, 
    {
      id: 8, name: 'Auckland Viaduct Harbour', lat: -36.8435, lon: 174.7633, schiffe: [

        {
          name: 'Schiff 15',
          type: 'Luxusyacht',
          capacity: 20,
          preisProNacht: 1000,
          inhalt: 'Luxus-Kabinen, Pool, Bar, Kino',
          bildUrls: ['assets/Boot 1 (2).png', 'assets/Boot 1 (1).png'],
          hafenId: 8
        }
      ]
    }, 
    {
      id: 9, name: 'Marina Bay', lat: 1.2834, lon: 103.8607, schiffe: [

        {
          name: 'Schiff 15',
          type: 'Luxusyacht',
          capacity: 20,
          preisProNacht: 1000,
          inhalt: 'Luxus-Kabinen, Pool, Bar, Kino',
          bildUrls: ['assets/Boot 1 (2).png', 'assets/Boot 1 (1).png'],
          hafenId: 9
        }
      ]
    }, {
      id: 10, name: 'Sydney Superyacht Marina', lat: -33.8688, lon: 151.2093, schiffe: [

        {
          name: 'Schiff 15',
          type: 'Luxusyacht',
          capacity: 20,
          preisProNacht: 1000,
          inhalt: 'Luxus-Kabinen, Pool, Bar, Kino',
          bildUrls: ['assets/Boot 1 (2).png', 'assets/Boot 1 (1).png'],
          hafenId: 10
        }
      ]
    }, 

  ];
  similarHaefen: string[] = [];
  filteredSchiffe: Schiff[] = [];
  searchQuery = '';
  selectedSchiff: Schiff | null = null;
  detailInserted: boolean[] = [];
  currentSlides: number[] = [];
  range: FormGroup; // Form group for date range

  constructor(private fb: FormBuilder, public dialog: MatDialog,  private benutzerService: BenutzerService,) {
    this.similarHaefen = this.hafens.map(hafen => hafen.name);
    this.range = this.fb.group({
      start: [],
      end: []
    });
  }

  onSearch(event: any) {
    const query = event.target.value.toLowerCase();
    if (query.length > 0) {
      this.similarHaefen = this.hafens.map(hafen => hafen.name).filter(name => name.toLowerCase().includes(query));
    } else {
      this.similarHaefen = this.hafens.map(hafen => hafen.name);
    }
    if (query === '') {
      this.filteredSchiffe = [];
    }
  }

  selectHafen(hafenName: string) {
    const selectedHafen = this.hafens.find(hafen => hafen.name === hafenName);
    if (selectedHafen) {
      this.filteredSchiffe = selectedHafen.schiffe || [];
      this.detailInserted = new Array(this.filteredSchiffe.length).fill(false);
      this.currentSlides = new Array(this.filteredSchiffe.length).fill(0);
    } else {
      this.filteredSchiffe = [];
      this.detailInserted = [];
      this.currentSlides = [];
    }
    this.similarHaefen = [];
    this.searchQuery = '';
  }

  toggleDetails(schiff: Schiff) {
    if (this.selectedSchiff === schiff) {
      this.selectedSchiff = null;
      this.detailInserted = new Array(this.filteredSchiffe.length).fill(false);
    } else {
      this.selectedSchiff = schiff;
      this.detailInserted = new Array(this.filteredSchiffe.length).fill(false);
    }
  }

  setDetailInserted(index: number) {
    this.detailInserted[index] = true;
  }

  plusSlides(n: number, index: number) {
    const slides = document.getElementsByClassName('mySlides') as HTMLCollectionOf<HTMLElement>;
    let currentSlide = this.currentSlides[index];
    currentSlide += n;
    if (currentSlide >= slides.length) { currentSlide = 0; }
    if (currentSlide < 0) { currentSlide = slides.length - 1; }
    this.currentSlides[index] = currentSlide;

    for (let i = 0; i < slides.length; i++) {
      slides[i].classList.remove('active');
    }
    slides[currentSlide].classList.add('active');
  }

  openForm() {
    if (!this.benutzerService.isLoggedIn()) {
      alert('Bitte melden Sie sich an, um das Buchungsformular auszufüllen.');
    } else {
      const dialogRef = this.dialog.open(BookingFormDialogComponent, {
        width: '400px',
        data: {
          startDate: this.range.controls['start'].value,
          endDate: this.range.controls['end'].value
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Handle the result here
        }
      });
    }
  }
}