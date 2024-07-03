import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule, MatSnackBarConfig } from '@angular/material/snack-bar';
import { BenutzerService } from '../benutzerservice/benutzerservice.component';

@Component({
  selector: 'app-booking-form-dialog',
  templateUrl: './booking-form-dialog.component.html',
  styleUrls: ['./booking-form-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule
  ]
})
export class BookingFormDialogComponent implements OnInit {
  bookingForm: FormGroup;
  haefen: any[] = [];
  bookedDates: Date[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<BookingFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private benutzerService: BenutzerService,
    private snackBar: MatSnackBar
  ) {
    console.log('Received data in dialog:', data);
    this.bookingForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      startDate: [{ value: data.startDate, disabled: true }],
      endDate: [{ value: data.endDate, disabled: true }],
      zielHafen: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.benutzerService.getHaefen().subscribe({
      next: haefen => {
        this.haefen = haefen;
      },
      error: error => {
        console.error('Fehler beim Laden der Häfen:', error);
      }
    });

    this.loadBookedDates(this.data.schiffId);
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


  openSnackBar(message: string, action: string, config?: MatSnackBarConfig) {
    this.snackBar.open(message, action, config);
  }

  onSubmit(): void {
    if (this.bookingForm.valid) {
      const startDate = this.bookingForm.get('startDate')?.value;
      const endDate = this.bookingForm.get('endDate')?.value;

      if (!startDate || !endDate) {
        this.openSnackBar('Bitte wählen Sie ein Datum aus', 'Schließen', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        return;
      }

      console.log('Booking form data:', this.bookingForm.value);

      this.benutzerService.updateSchiffHafen(this.data.schiffId, this.bookingForm.value.zielHafen).subscribe({
        next: (updateResponse) => {
          console.log('Update response:', updateResponse);

          const formatDate = (date: Date): string => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
          };

          const bookingData = {
            ...this.bookingForm.getRawValue(),
            schiffId: this.data.schiffId,
            startDate: formatDate(this.bookingForm.getRawValue().startDate),
            endDate: formatDate(this.bookingForm.getRawValue().endDate),
            zielHafenName: this.haefen.find(hafen => hafen.id === this.bookingForm.value.zielHafen)?.name
          };

          this.benutzerService.addAusleihen(bookingData).subscribe({
            next: (bookingResponse) => {
              console.log('Booking response:', bookingResponse);
              this.dialogRef.close(bookingData);
            },
            error: (bookingError) => {
              console.error('Fehler beim Hinzufügen der Ausleihe:', bookingError);
            }
          });
        },
        error: (updateError) => {
          console.error('Fehler beim Aktualisieren des Hafens:', updateError);
        }
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
