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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBarConfig } from '@angular/material/snack-bar';

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
    MatDialogModule,
    MatSnackBarModule
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
  bookedDates: Date[] = [];

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private benutzerService: BenutzerService,
    private snackBar: MatSnackBar
  ) {
    this.range = this.fb.group({
      start: [],
      end: []
    });
  }

  openSnackBar(message: string, action: string, config?: MatSnackBarConfig) {
    this.snackBar.open(message, action, config);
  }

  ngOnInit() {
    this.loadSchiffe();

    this.benutzerService.onTicketUpdate().subscribe({
      next: (data) => {
        console.log('Ticket Update:', data);
        this.loadSchiffe();
      },
      error: (err) => console.error('Error receiving ticket updates', err)
    });

    this.benutzerService.onNewComment().subscribe({
      next: (data) => {
        console.log('New Comment:', data);
        this.loadComments();
      },
      error: (err) => console.error('Error receiving new comments', err)
    });
  }

  loadSchiffe() {
    this.benutzerService.getSchiffe().subscribe({
      next: (schiffe: Schiff[]) => {
        console.log('Fetched schiffe:', schiffe);
        this.hafens = this.transformToHafens(schiffe);
        this.similarHaefen = this.hafens.map(hafen => hafen.name);
        console.log('Hafens:', this.hafens);
        console.log('Similar Hafens:', this.similarHaefen);
      },
      error: (err) => console.error('Failed to load schiffe', err)
    });
  }

  loadComments() {
    this.benutzerService.getComments().subscribe({
      next: (comments) => {
        console.log('Fetched comments:', comments);

      },
      error: (err) => console.error('Failed to load comments', err)
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
      this.loadBookedDates(schiff.id);
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
    const startDate = this.range.controls['start'].value;
    const endDate = this.range.controls['end'].value;

    if (!this.benutzerService.isLoggedIn()) {
      this.openSnackBar('Sie müssen angemeldet sein, um das Formular zum Buchen auszufüllen', 'Schließen', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      return;
    }


    this.loadBookedDates(schiff.id);


    setTimeout(() => {

      if (this.checkDateConflict(startDate, endDate)) {
        this.openSnackBar('Das Schiff ist bereits in dem ausgewählten Zeitraum gebucht', 'Schließen', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
        return;
      }

      const dialogRef = this.dialog.open(BookingFormDialogComponent, {
        width: '400px',
        data: {
          startDate,
          endDate,
          schiffId: schiff.id
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          console.log('Form result:', result);


          const currentHafen = this.hafens.find(h => h.schiffe!.some(s => s.id === result.schiffId));
          if (currentHafen) {
            currentHafen.schiffe = currentHafen.schiffe!.filter(s => s.id !== result.schiffId);
          }


          const newHafen = this.hafens.find(h => h.id === result.zielHafen);
          if (newHafen) {
            const movedSchiff = this.filteredSchiffe.find(s => s.id === result.schiffId);
            if (movedSchiff) {
              movedSchiff.hafenId = result.zielHafen;
              movedSchiff.hafenName = newHafen.name;
              newHafen.schiffe!.push(movedSchiff);
            }
          }


          this.selectedSchiff = null;

          this.loadSchiffe();

          this.openSnackBar(`Buchung erfolgreich, das Schiff befindet sich nun im ${newHafen?.name} Hafen`, 'Schließen', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        }
      });
    }, 1000);
  }

  checkDateConflict(startDate: Date, endDate: Date): boolean {
    return this.bookedDates.some(bookedDate => {
      return (
        (startDate >= bookedDate && startDate <= bookedDate) ||
        (endDate >= bookedDate && endDate <= bookedDate) ||
        (startDate <= bookedDate && endDate >= bookedDate)
      );
    });
  }

  loadBookedDates(schiffId: number) {
    this.benutzerService.getBookedDates(schiffId).subscribe({
      next: (dates: { startDate: string, endDate: string }[]) => {
        this.bookedDates = dates.flatMap(date => {
          const start = new Date(date.startDate);
          const end = new Date(date.endDate);
          const datesArray = [];
          for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
            datesArray.push(new Date(d));
          }
          return datesArray;
        });
      },
      error: (err) => console.error('Failed to load booked dates', err)
    });
  }

  myDateFilter = (d: Date | null): boolean => {
    const date = (d || new Date()).setHours(0, 0, 0, 0);
    return !this.bookedDates.some(booked => booked.setHours(0, 0, 0, 0) === date);
  };


}
