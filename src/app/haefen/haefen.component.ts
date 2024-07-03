import { Component, OnInit, Renderer2, HostListener } from '@angular/core';
import Globe from 'globe.gl';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { BenutzerService } from '../benutzerservice/benutzerservice.component';

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
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class HaefenComponent implements OnInit {
  hafens: Hafen[] = [];
  searchControl = new FormControl();
  filteredHafens!: Observable<Hafen[]>;
  globeInstance: any;
  selectedHafen: Hafen | null = null;

  constructor(
    private renderer: Renderer2,
    private benutzerService: BenutzerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadHaefen();

    this.filteredHafens = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );

    this.initGlobus();
    window.addEventListener('resize', this.onResize.bind(this));
  }

  loadHaefen(): void {
    this.benutzerService.getHaefen().subscribe({
      next: (hafens) => {
        this.hafens = hafens;
        this.filteredHafens = of(this.hafens);
        this.updateGlobus('');
      },
      error: (err) => console.error('Failed to load haefen', err)
    });
  }

  private _filter(value: string): Hafen[] {
    const filterValue = value.toLowerCase();
    return this.hafens.filter(hafen => hafen.name.toLowerCase().includes(filterValue));
  }

  onSearch(event: any): void {
    const query = event.target.value.toLowerCase();
    this.filteredHafens = of(this._filter(query));
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

  navigateToSchiffe(hafenId: number): void {
    this.router.navigate(['/schiffe'], { queryParams: { hafenId } });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    if (this.globeInstance) {
      const globeElement = document.getElementById('globeViz');
      if (globeElement) {
        this.globeInstance.width(globeElement.clientWidth);
        this.globeInstance.height(globeElement.clientHeight);
      }
    }
  }
}
