import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-kalender',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kalender.component.html',
  styleUrls: ['./kalender.component.css']
})
export class KalenderComponent implements OnInit {
  benutzer: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadBenutzer();
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
}
