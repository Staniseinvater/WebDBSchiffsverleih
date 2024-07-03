import { Component, OnInit } from '@angular/core';

export interface Hafen {
  id: number;
  name: string;
  lat: number;
  lon: number;
}

@Component({
  selector: 'app-haefen',
  templateUrl: './haefen.component.html',
  styleUrls: ['./haefen.component.css']
})
export class HaefenComponent implements OnInit {
  hafens: Hafen[] = [
    { id: 1, name: 'Hamburg', lat: 53.5511, lon: 9.9937 },
    { id: 2, name: 'Rotterdam', lat: 51.9225, lon: 4.47917 },
  ];

  filteredHafens: Hafen[] = [];
  selectedHafen: Hafen | null = null;

  ngOnInit(): void {
    this.filteredHafens = this.hafens;
  }

  onSearch(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredHafens = this.hafens.filter(hafen => hafen.name.toLowerCase().includes(query));
  }

  selectHafen(hafen: Hafen): void {
    this.selectedHafen = hafen;
  }
}