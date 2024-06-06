import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Schiff {
  name: string;
  type: string;
  capacity: number;
  preisProNacht: number;
  inhalt: string;
  bildUrl: string;
  hafenId: number;
}

interface Hafen {
  id: number;
  name: string;
  lat: number;
  lon: number;
  schiffe?: Schiff[];
}

@Component({
  selector: 'app-schiffe',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './schiffe.component.html',
  styleUrls: ['./schiffe.component.css']
})
export class SchiffeComponent {
  hafens: Hafen[] = [
    {
      id: 1, name: 'Hamburg', lat: 53.5511, lon: 9.9937, schiffe: [
        {
          name: 'Schiff 1',
          type: 'Yacht',
          capacity: 10,
          preisProNacht: 200,
          inhalt: 'Luxus-Kabinen, Pool, Bar',
          bildUrl: 'https://www.br.de/radio/bayern2/sendungen/radiowelt/schiff-114~_v-img__16__9__l_-1dc0e8f74459dd04c91a0d45af4972b9069f1135.jpg?version=9ce41',
          hafenId: 1
        },
        {
          name: 'Schiff 2',
          type: 'Segelboot',
          capacity: 8,
          preisProNacht: 150,
          inhalt: 'Kabinen, Küche, Deck',
          bildUrl: 'assets/images/bild1.png',
          hafenId: 1
        }, 
        {
          name: 'Schiff 3',
          type: 'Segelboot',
          capacity: 8,
          preisProNacht: 150,
          inhalt: 'Kabinen, Küche, Deck',
          bildUrl: 'assets/images/bild1.png',
          hafenId: 1
        },
        {
          name: 'Schiff 4',
          type: 'Segelboot',
          capacity: 8,
          preisProNacht: 150,
          inhalt: 'Kabinen, Küche, Deck',
          bildUrl: 'assets/images/bild1.png',
          hafenId: 1
        },
        {
          name: 'Schiff 5',
          type: 'Segelboot',
          capacity: 8,
          preisProNacht: 150,
          inhalt: 'Kabinen, Küche, Deck',
          bildUrl: 'assets/images/bild1.png',
          hafenId: 1
        }

      ]
    },
    {
      id: 2, name: 'Rotterdam', lat: 51.9225, lon: 4.47917, schiffe: [
        {
          name: 'Schiff 6',
          type: 'Kreuzfahrtschiff',
          capacity: 300,
          preisProNacht: 400,
          inhalt: 'Restaurants, Kino, Fitnessstudio',
          bildUrl: 'assets/images/schiff3.jpg',
          hafenId: 2
        },  
        {
          name: 'Schiff 7',
          type: 'Kreuzfahrtschiff',
          capacity: 300,
          preisProNacht: 400,
          inhalt: 'Restaurants, Kino, Fitnessstudio',
          bildUrl: 'assets/images/schiff3.jpg',
          hafenId: 2
        }, 
         {
          name: 'Schiff 8',
          type: 'Kreuzfahrtschiff',
          capacity: 300,
          preisProNacht: 400,
          inhalt: 'Restaurants, Kino, Fitnessstudio',
          bildUrl: 'assets/images/schiff3.jpg',
          hafenId: 2
        },
      ]
    },
    {
      id: 3, name: 'Port Hercule', lat: 43.7333, lon: 7.4200, schiffe: [
        {
          name: 'Schiff 9',
          type: 'Luxusyacht',
          capacity: 20,
          preisProNacht: 1000,
          inhalt: 'Luxus-Kabinen, Pool, Bar, Kino',
          bildUrl: 'assets/images/schiff4.jpg',
          hafenId: 3
        }, {
          name: 'Schiff 10',
          type: 'Luxusyacht',
          capacity: 20,
          preisProNacht: 1000,
          inhalt: 'Luxus-Kabinen, Pool, Bar, Kino',
          bildUrl: 'assets/images/schiff4.jpg',
          hafenId: 3
        }, {
          name: 'Schiff 11',
          type: 'Luxusyacht',
          capacity: 20,
          preisProNacht: 1000,
          inhalt: 'Luxus-Kabinen, Pool, Bar, Kino',
          bildUrl: 'assets/images/schiff4.jpg',
          hafenId: 3
        }
      ]
    }
    // Weitere Häfen und Schiffe hier hinzufügen
  ];

  similarHaefen: string[] = [];
  filteredSchiffe: Schiff[] = [];
  searchQuery = ''; // Variable für das Suchfeld
  selectedSchiff: Schiff | null = null; // Hinzugefügt: Variable für das ausgewählte Schiff

  constructor() {
    this.similarHaefen = this.hafens.map(hafen => hafen.name); // Initialisiere similarHaefen mit allen Häfen
  }

  onSearch(event: any) {
    const query = event.target.value.toLowerCase();
    console.log('Suchbegriff:', query); // Debugging-Statement
    if (query.length > 0) {
      this.similarHaefen = this.hafens.map(hafen => hafen.name).filter(name => name.toLowerCase().includes(query));
      console.log('Ähnliche Häfen:', this.similarHaefen); // Debugging-Statement
    } else {
      this.similarHaefen = this.hafens.map(hafen => hafen.name);
    }
    if (query === '') {
      this.filteredSchiffe = [];
    }
  }

  selectHafen(hafenName: string) {
    console.log('Ausgewählter Hafen:', hafenName); // Debugging-Statement
    const selectedHafen = this.hafens.find(hafen => hafen.name === hafenName);
    if (selectedHafen) {
      this.filteredSchiffe = selectedHafen.schiffe || [];
    } else {
      this.filteredSchiffe = [];
    }
    this.similarHaefen = [];
    this.searchQuery = ''; // Zurücksetzen der Suchleiste
  }

  // Hinzugefügt: Methode zum Umschalten der Details
  toggleDetails(schiff: Schiff) {
    if (this.selectedSchiff === schiff) {
      this.selectedSchiff = null;
    } else {
      this.selectedSchiff = schiff;
    }
  }
  
  
}
