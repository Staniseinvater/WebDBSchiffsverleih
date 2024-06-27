import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
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
    MatSelectModule
  ]
})
export class BookingFormDialogComponent implements OnInit {
  bookingForm: FormGroup;
  haefen: any[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<BookingFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private benutzerService: BenutzerService
  ) {
    console.log('Received data in dialog:', data); // Log the data received
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
  }

  onSubmit(): void {
    if (this.bookingForm.valid) {
      console.log('Booking form data:', this.bookingForm.value); // Log form data
      this.benutzerService.updateSchiffHafen(this.data.schiffId, this.bookingForm.value.zielHafen).subscribe({
        next: (response) => {
          console.log('Update response:', response); // Log response
          this.dialogRef.close({
            ...this.bookingForm.value,
            schiffId: this.data.schiffId // Ensure schiffId is passed back
          });
        },
        error: (error) => {
          console.error('Fehler beim Aktualisieren des Hafens:', error);
        }
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
