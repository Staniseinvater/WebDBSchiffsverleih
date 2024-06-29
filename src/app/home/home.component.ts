import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { BenutzerService } from '../benutzerservice/benutzerservice.component';
import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    CommonModule, HttpClientModule, FormsModule , MatSnackBarModule ],
  providers: [BenutzerService]
})
export class HomeComponent implements OnInit {

  testimonials: any[] = [];
  @ViewChild('slider') slider!: ElementRef;
  index = 0;
  newComment = { author: '', location: '', text: '' };
  isLoggedIn: boolean = false;

  constructor(private benutzerService: BenutzerService, private snackBar: MatSnackBar) {}

  openSnackBar(message: string, action: string, config?: MatSnackBarConfig) {
    this.snackBar.open(message, action, config);
  }

  ngOnInit() {
    this.isLoggedIn = this.benutzerService.isLoggedIn();
    this.loadComments();
    setInterval(() => this.showNextSlide(), 5000);
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

    this.benutzerService.addComment(this.newComment).subscribe(response => {
      this.openSnackBar('Kommentar hinzugefügt', 'Schließen', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
      this.loadComments();
      this.newComment = { author: '', location: '', text: '' };
    }, error => {
      console.error('Error adding comment:', error);
    });
  }

  logout() {
    this.benutzerService.logout();
    this.isLoggedIn = false;
    this.openSnackBar('Sie wurden ausgeloggt', 'Schließen', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }
}