import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BenutzerService } from '../benutzerservice/benutzerservice.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatSnackBarConfig } from '@angular/material/snack-bar';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, MatSnackBarModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup; 

  constructor(
    private fb: FormBuilder,
    private benutzerService: BenutzerService,
    private snackBar: MatSnackBar 
  ) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  openSnackBar(message: string, action: string, config?: MatSnackBarConfig) {
    this.snackBar.open(message, action, config);
  }

  private openErrorSnackBar(message: string) {
    this.openSnackBar(message, 'Schließen', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }

  private openSuccessSnackBar(message: string) {
    this.openSnackBar(message, 'Schließen', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  onSubmit() {
    this.benutzerService.register(this.registerForm.value).subscribe({
      next: (response) => {
        this.openSuccessSnackBar('Sie sind erfolgreich registriert');
      },
      complete: () => {
        console.log('Registration complete');
      },
      error: (error) => {
        let errorMessage = 'Serverfehler';
        if (error.status === 400) {
          errorMessage = 'Bitte füllen Sie alle Felder aus';
        } else if (error.status === 409) {
          errorMessage = 'Benutzername bereits vergeben';
        }
        this.openErrorSnackBar(errorMessage);
      }
    });
  }
}

// 200 - OK *
// 201 - Created
// 204 - No Content
// 400 - Bad Request *
// 401 - Unauthorized *
// 403 - Forbidden *
// 404 - Not Found *
// 405 - Method Not Allowed
// 409 - Conflict *
// 415 - Unsupported Media Type
// 422 - Unprocessable Entity
// 500 - Internal Server Error *
// 502 - Bad Gateway
// 503 - Service Unavailable