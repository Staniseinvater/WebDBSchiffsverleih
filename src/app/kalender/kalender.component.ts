import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-kalender',
  standalone: true,
  imports: [CommonModule, HttpClientModule, NgFor, NgIf],
  templateUrl: './kalender.component.html',
  styleUrls: ['./kalender.component.css']
})
export class KalenderComponent implements OnInit {
  benutzer: any[] = [];
  schiffe: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadBenutzer();
    this.loadSchiffe();
  }

  loadBenutzer(): void {
    this.http.get<any[]>('http://localhost:8081/benutzer')
      .subscribe({
        next: data => {
          console.log('Data fetched:', data); // Debugging line to check fetched data
          this.benutzer = data;
        },
        error: err => console.error('Failed to load benutzer', err)
      });
  }

  loadSchiffe(): void {
    this.http.get<any[]>('http://localhost:8081/schiffe')
      .subscribe({
        next: data => {
          console.log('Data fetched:', data); // Debugging line to check fetched data
          this.schiffe = data;
        },
        error: err => console.error('Failed to load schiffe', err)
      });
  }
}
