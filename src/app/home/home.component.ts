import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { BenutzerService } from '../benutzerservice/benutzerservice.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule  // Include FormsModule here
  ],
  providers: [BenutzerService]
})
export class HomeComponent implements OnInit {
  testimonials: any[] = [];
  @ViewChild('slider') slider!: ElementRef;
  index = 0;
  newComment = { author: '', location: '', text: '' };

  constructor(private benutzerService: BenutzerService) {}

  ngOnInit() {
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
    this.benutzerService.addComment(this.newComment).subscribe(response => {
      console.log('Comment added:', response);
      this.loadComments();
      this.newComment = { author: '', location: '', text: '' };
    }, error => {
      console.error('Error adding comment:', error);
    });
  }
}
