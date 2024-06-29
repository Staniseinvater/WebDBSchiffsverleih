import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BenutzerService } from '../benutzerservice/benutzerservice.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { BookingFormDialogComponent } from '../booking-form-dialog/booking-form-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Schiff } from '../models/schiff.model';

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
export class SchiffeComponent implements OnInit {
  hafens: Hafen[] = [];
  similarHaefen: string[] = [];
  filteredSchiffe: Schiff[] = [];
  searchQuery = '';
  selectedSchiff: Schiff | null = null;
  detailInserted: boolean[] = [];
  currentSlides: number[] = [];
  range: FormGroup;
  detailsVisible: boolean[] = [];

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private benutzerService: BenutzerService
  ) {
    this.range = this.fb.group({
      start: [],
      end: []
    });
  }

  ngOnInit() {
    this.loadSchiffe();
  }

  loadSchiffe() {
    this.benutzerService.getSchiffe().subscribe({
      next: (schiffe: Schiff[]) => {
        console.log('Fetched schiffe:', schiffe); // Debugging line
        this.hafens = this.transformToHafens(schiffe);
        this.similarHaefen = this.hafens.map(hafen => hafen.name);
        console.log('Hafens:', this.hafens); // Debugging line
        console.log('Similar Hafens:', this.similarHaefen); // Debugging line
      },
      error: (err) => console.error('Failed to load schiffe', err)
    });
  }

  transformToHafens(schiffe: Schiff[]): Hafen[] {
    const hafenMap: { [key: string]: Hafen } = {};
    schiffe.forEach(schiff => {
      if (schiff.hafenName !== undefined) {
        if (!hafenMap[schiff.hafenName]) {
          hafenMap[schiff.hafenName] = { id: schiff.hafenId, name: schiff.hafenName, lat: 0, lon: 0, schiffe: [] };
        }
        hafenMap[schiff.hafenName].schiffe!.push(schiff);
      }
    });
    return Object.values(hafenMap);
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
      this.detailsVisible = new Array(this.filteredSchiffe.length).fill(false);
    } else {
      this.filteredSchiffe = [];
      this.detailInserted = [];
      this.currentSlides = [];
      this.detailsVisible = [];
    }
    this.similarHaefen = [];
    this.searchQuery = '';
  }

  toggleDetails(schiff: Schiff, index: number) {
    if (this.selectedSchiff === schiff) {
      this.selectedSchiff = null;
      this.detailInserted[index] = false;
    } else {
      this.selectedSchiff = schiff;
      this.detailInserted[index] = true;
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

  toggleDetailsContent(index: number) {
    this.detailsVisible[index] = !this.detailsVisible[index];
  }

  openForm(schiff: Schiff) {
    if (!this.benutzerService.isLoggedIn()) {
      alert('Bitte melden Sie sich an, um das Buchungsformular auszufüllen.');
    } else {
      const dialogRef = this.dialog.open(BookingFormDialogComponent, {
        width: '400px',
        data: {
          startDate: this.range.controls['start'].value,
          endDate: this.range.controls['end'].value,
          schiffId: schiff.id // Übergeben Sie die schiffId
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          console.log('Form result:', result); // Log form result

          // Find the ship's current harbor and remove it from there
          const currentHafen = this.hafens.find(h => h.schiffe!.some(s => s.id === result.schiffId));
          if (currentHafen) {
            currentHafen.schiffe = currentHafen.schiffe!.filter(s => s.id !== result.schiffId);
          }

          // Add the ship to the new harbor
          const newHafen = this.hafens.find(h => h.id === result.zielHafen);
          if (newHafen) {
            const movedSchiff = this.filteredSchiffe.find(s => s.id === result.schiffId);
            if (movedSchiff) {
              movedSchiff.hafenId = result.zielHafen;
              movedSchiff.hafenName = newHafen.name;
              newHafen.schiffe!.push(movedSchiff);
            }
          }

          // Close the details card
          this.selectedSchiff = null;

          // Reload the ships to reflect changes
          this.loadSchiffe();
        }
      });
    }
  }
}