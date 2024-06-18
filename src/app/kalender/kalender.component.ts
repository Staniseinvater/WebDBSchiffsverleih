
import { Component, OnInit } from '@angular/core';
import { BenutzerService } from '../benutzerservice/benutzerservice.component';

@Component({
  selector: 'app-kalender',
  templateUrl: './kalender.component.html',
  styleUrls: ['./kalender.component.css']
})
export class KalenderComponent implements OnInit {
  benutzer: any[] = [];

  constructor(private benutzerService: BenutzerService) { }

  ngOnInit(): void {
    this.benutzerService.getBenutzer().subscribe(data => {
      this.benutzer = data;
    });
  }
}
