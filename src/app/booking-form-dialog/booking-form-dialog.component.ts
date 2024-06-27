import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

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
    MatButtonModule
  ]
})
export class BookingFormDialogComponent {
  bookingForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<BookingFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.bookingForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      startDate: [{ value: data.startDate, disabled: true }],
      endDate: [{ value: data.endDate, disabled: true }]
    });
  }

  onSubmit(): void {
    if (this.bookingForm.valid) {
      console.log('Form data:', this.bookingForm.value);
      this.dialogRef.close(this.bookingForm.value);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
