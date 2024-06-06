import { Component, OnInit, Renderer2 } from '@angular/core';
import Globe from 'globe.gl';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

export interface Hafen {
  id: number;
  name: string;
  lat: number;
  lon: number;
  street: string;
  capacity: number;
  imageUrl: string;
}

@Component({
  selector: 'app-haefen',
  templateUrl: './haefen.component.html',
  styleUrls: ['./haefen.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class HaefenComponent implements OnInit {
  hafens: Hafen[] = [
    { id: 1, name: 'Hamburg', lat: 53.5511, lon: 9.9937, street: 'Street Hamburg', capacity: 500, imageUrl: 'assets/hamburg.jpg' },
    { id: 2, name: 'Rotterdam', lat: 51.9225, lon: 4.47917, street: 'Street Rotterdam', capacity: 600, imageUrl: 'assets/rotterdam.jpg' },
    { id: 3, name: 'Port Hercule', lat: 43.7333, lon: 7.4200, street: 'Street Port Hercule', capacity: 700, imageUrl: 'assets/hercule.jpg' },
    { id: 4, name: 'Marina di Portofino', lat: 44.3038, lon: 9.2101, street: 'Street Marina di Portofino', capacity: 800, imageUrl: 'assets/portofino.jpg' },
    { id: 5, name: 'Puerto Banús', lat: 36.4874, lon: -4.9526, street: 'Street Puerto Banús', capacity: 900, imageUrl: 'assets/banus.jpg' },
    { id: 6, name: 'Port Vauban', lat: 43.5804, lon: 7.1282, street: 'Street Port Vauban', capacity: 1000, imageUrl: 'assets/vauban.jpg' },
    { id: 7, name: 'Marina del Rey', lat: 33.9777, lon: -118.4351, street: 'Street Marina del Rey', capacity: 1100, imageUrl: 'assets/delrey.jpg' },
    { id: 8, name: 'Auckland Viaduct Harbour', lat: -36.8435, lon: 174.7633, street: 'Street Auckland Viaduct Harbour', capacity: 1200, imageUrl: 'assets/auckland.jpg' },
    { id: 9, name: 'Marina Bay', lat: 1.2834, lon: 103.8607, street: 'Street Marina Bay', capacity: 1300, imageUrl: 'assets/marina.jpg' },
    { id: 10, name: 'Sydney Superyacht Marina', lat: -33.8688, lon: 151.2093, street: 'Street Sydney Superyacht Marina', capacity: 1400, imageUrl: 'assets/sydney.jpg' }
  ];

  searchControl = new FormControl();
  filteredHafens!: Observable<Hafen[]>;
  globeInstance: any;
  selectedHafen: Hafen | null = null;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.filteredHafens = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );

    this.initGlobus();
  }

  private _filter(value: string): Hafen[] {
    const filterValue = value.toLowerCase();
    return this.hafens.filter(hafen => hafen.name.toLowerCase().includes(filterValue));
  }

  onSearch(event: any): void {
    const query = event.target.value.toLowerCase();
    this.updateGlobus(query);
  }

  initGlobus(): void {
    const globeElement = document.getElementById('globeViz');
    if (globeElement) {
      this.renderer.setStyle(globeElement, 'width', '100%');
      this.renderer.setStyle(globeElement, 'height', '100%');

      const globe = Globe({
        rendererConfig: { antialias: true }
      })
        .width(globeElement.clientWidth)
        .height(globeElement.clientHeight)
        .backgroundColor('#000011')
        (globeElement)
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
        .htmlElementsData(this.getHafenPoints(this.hafens))
        .htmlElement((d: any) => {
          const hafen = this.hafens.find(h => h.name === d.name);
          if (!hafen) return document.createElement('div');
          const el = document.createElement('div');
          el.innerHTML = `<svg viewBox="-4 0 36 36">
            <path fill="currentColor" d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"></path>
            <circle fill="black" cx="14" cy="14" r="7"></circle>
          </svg>`;
          el.style.color = 'red';
          el.style.width = '10px';
          el.style.pointerEvents = 'auto';
          el.style.cursor = 'pointer';
          el.onclick = () => this.selectHafen(hafen);
          return el;
        });

      const canvas = globeElement.querySelector('canvas');
      if (canvas) {
        this.renderer.setStyle(canvas, 'width', '100%');
        this.renderer.setStyle(canvas, 'height', '100%');
        this.renderer.setStyle(canvas, 'background-color', '#000011');
      }

      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = 0.2;

      this.globeInstance = globe;
    }
  }

  updateGlobus(query: string): void {
    const filteredHafens = this._filter(query);
    if (this.globeInstance) {
      this.globeInstance.htmlElementsData(this.getHafenPoints(filteredHafens));
    }
  }

  getHafenPoints(hafens: Hafen[]) {
    return hafens.map(hafen => ({
      lat: hafen.lat,
      lng: hafen.lon,
      name: hafen.name
    }));
  }

  selectHafen(hafen: Hafen): void {
    this.selectedHafen = hafen;
    if (this.globeInstance) {
      this.globeInstance.pointOfView({ lat: hafen.lat, lng: hafen.lon, altitude: 0.7 }, 2000);
    }
  }
}
