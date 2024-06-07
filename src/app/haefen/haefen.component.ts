import { Component, OnInit, Renderer2, HostListener } from '@angular/core';
import Globe from 'globe.gl';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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
  hafens: Hafen[] = [
    { id: 1, name: 'Hamburg', lat: 53.5511, lon: 9.9937, street: 'Kaltehofe-Hinterdeich 9, 20539 Hamburg', capacity: 2000, imageUrl: 'https://www.maritime-elbe.de/wp-content/uploads/2019/04/Hamburger-Yachthafen-Wedel.jpg' },
    { id: 2, name: 'Rotterdam', lat: 51.9225, lon: 4.47917, street: 'Rijksboom 90, 3071 AX Rotterdam, Niederlande', capacity: 600, imageUrl: 'https://media-cdn.tripadvisor.com/media/photo-s/16/b8/b2/72/do-you-know-the-entrepot.jpg' },
    { id: 3, name: 'Port Hercule', lat: 43.7333, lon: 7.4200, street: 'quail Hirondelle 30, 98000 Monaco, Monaco', capacity: 700, imageUrl: 'https://apiv2.marina-guide.de/image.php?name=f11fdb3c5da36ddd2d260924e396a84ea3768c5a4a9dd336ed751c47840e9d58.jpg' },
    { id: 4, name: 'Marina di Portofino', lat: 44.3038, lon: 9.2101, street: 'Via Roma 35, 16034 Portofino, Italien', capacity: 16, imageUrl: 'https://apiv2.marina-guide.de/image.php?name=55a50887fcb8005067585af322ae0764c55a12f32ec928e99a9d178e70487492.jpg' },
    { id: 5, name: 'Puerto Banús', lat: 36.4874, lon: -4.9526, street: 'Muelle de Honor – Torre de Control Marbella Málaga ES 29660, 29660 Marbella, Málaga, Spanien', capacity: 900, imageUrl: 'https://www.marbella-ev.com/wp-content/uploads/2020/07/puerto-banuspanorama-scaled.jpg' },
    { id: 6, name: 'Port Vauban', lat: 43.5804, lon: 7.1282, street: 'Av. de Verdun, 06600 Antibes, Frankreich', capacity: 1700, imageUrl: 'https://www.pco-yachting.com/d9/sites/default/files/styles/crop_extra_panorama/public/2022-11/Antibes-12.jpg?itok=Aq1DErmf' },
    { id: 7, name: 'Marina del Rey', lat: 33.9777, lon: -118.4351, street: 'Kalifornien 90292, USA', capacity: 1100, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Marina_del_Rey_P4070297.jpg/1200px-Marina_del_Rey_P4070297.jpg' },
    { id: 8, name: 'Auckland Viaduct Harbour', lat: -36.8435, lon: 174.7633, street: 'Viaduct HarbourAuckland CBD, Auckland 1010, Neuseeland', capacity: 1200, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Viaduct_Basin_Auckland_01.jpg/1200px-Viaduct_Basin_Auckland_01.jpg' },
    { id: 9, name: 'Marina Bay', lat: 1.2834, lon: 103.8607, street: '323 W 6th St, Clear Lake Shores, TX 77565, USA', capacity: 1300, imageUrl: 'https://www.bayharbor.com/wp-content/uploads/2022/06/DJI_0580-1024x683.jpg' },
    { id: 10, name: 'Sydney Superyacht Marina', lat: -33.8688, lon: 151.2093, street: '2 Maritime Court, Rozelle NSW 2039, Australien', capacity: 1400, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7vPHQdGxxnmj1CWmClig3l2QZgeEhXeho1g&s' }
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
    window.addEventListener('resize', this.onResize.bind(this));
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
