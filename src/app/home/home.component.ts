import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BenutzerService } from '../benutzerservice/benutzerservice.component';
import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import e from 'cors';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    CommonModule, HttpClientModule, FormsModule, MatSnackBarModule
  ],
  providers: [BenutzerService]
})
export class HomeComponent implements OnInit {
  testimonials: any[] = [];
  @ViewChild('slider') slider!: ElementRef;
  index = 0;
  newComment = { author: '', location: '', text: '' };
  isLoggedIn: boolean = false;
  userName: string = '';
  private subscription: Subscription = new Subscription();


  constructor(private benutzerService: BenutzerService, private snackBar: MatSnackBar) { }

  openSnackBar(message: string, action: string, config?: MatSnackBarConfig) {
    this.snackBar.open(message, action, config);
  }

  ngOnInit() {
    this.checkLoggedInUser();
    this.loadComments();
    setInterval(() => this.showNextSlide(), 5000);
  }

  checkLoggedInUser() {
    this.subscription.add(
      this.benutzerService.isLoggedIn$.subscribe(loggedIn => {
        this.isLoggedIn = loggedIn;
        if (this.isLoggedIn) {
          this.userName = this.benutzerService.getUserName() || 'Benutzer';
        } else {
          this.userName = '';
        }
      })
    );
  }

  loadComments() {
    this.benutzerService.getComments().subscribe(comments => {
      this.testimonials = comments.map(comment => ({
        quote: comment.text,
        author: `${comment.author}, ${comment.location}`
      }));
    }, error => {
      console.error('Error loading comments:', error);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  showNextSlide() {
    this.index++;
    if (this.index >= this.testimonials.length) {
      this.index = 0;
    }
    this.slider.nativeElement.style.transform = `translateX(${-this.index * 100}%)`;
  }

  addComment() {
    if (!this.isLoggedIn) {
      this.openSnackBar('Sie müssen angemeldet sein, um kommentieren zu können', 'Schließen', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.newComment.author = this.userName;

    this.benutzerService.addComment(this.newComment).subscribe(
      response => {
        this.openSnackBar('Kommentar hinzugefügt', 'Schließen', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.loadComments();
        this.newComment = { author: '', location: '', text: '' };
      },
      error => {
        console.error('Error adding comment:', error);
        let message = 'Fehler beim Hinzufügen des Kommentars';
        if (error.status === 401 || error.status === 403) {
          message = 'Sie müssen angemeldet sein, um kommentieren zu können';
        }
        this.openSnackBar(message, 'Schließen', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    );
  }
}