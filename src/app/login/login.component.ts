import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BenutzerService } from '../benutzerservice/benutzerservice.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatSnackBarConfig } from '@angular/material/snack-bar';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatSnackBarModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private benutzerService: BenutzerService,
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

    this.benutzerService.login(this.loginForm.value).subscribe(
      (response) => {
        console.log(response);
        this.openSnackBar('Sie sind erfolgreich eingeloggt', 'Schließen', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      (error) => {
        let errorMessage = 'Serverfehler';
        if (error.status === 401) {
          errorMessage = 'Ungültige Anmeldedaten';
        } else if (error.status === 400) {
          errorMessage = 'Bitte füllen Sie alle Felder aus';
        }

        this.openSnackBar(errorMessage, 'Schließen', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      }
    );
  }
}