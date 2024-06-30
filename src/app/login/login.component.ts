import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BenutzerService } from '../benutzerservice/benutzerservice.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router } from '@angular/router';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatSnackBarModule, CommonModule, FontAwesomeModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hidePassword: boolean = true; 
  faEye = faEye; 
  faEyeSlash = faEyeSlash; 

  constructor(
    private fb: FormBuilder,
    private benutzerService: BenutzerService,
    private router: Router,
    private snackBar: MatSnackBar // Inject MatSnackBar here
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  
  openSnackBar(message: string, action: string, config?: MatSnackBarConfig) {
    this.snackBar.open(message, action, config);
  }

  onSubmit() {
    this.benutzerService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log(response);
        localStorage.setItem('token', response.token); // Token speichern
        this.openSnackBar('Sie sind erfolgreich eingeloggt', 'Schließen', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/']);
      },
      error: (error) => {
        let errorMessage = 'Serverfehler';
        if (error.status === 401) {
          errorMessage = 'Ungültige Anmeldedaten oder der Benutzer existiert nicht';
        } else if (error.status === 400) {
          errorMessage = 'Bitte füllen Sie alle Felder aus';
        }
        this.openSnackBar(errorMessage, 'Schließen', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      }
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
