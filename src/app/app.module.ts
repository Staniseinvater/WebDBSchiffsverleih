import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BookingFormDialogComponent } from './booking-form-dialog/booking-form-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';

// Entfernen Sie die Zeile, die den SchiffeComponent importiert, wenn es standalone ist

@NgModule({
  declarations: [
    AppComponent,
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([]),
    BrowserAnimationsModule,
    BookingFormDialogComponent,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDialogModule,
    // SchiffeComponent ist standalone und sollte hier nicht importiert werden
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
