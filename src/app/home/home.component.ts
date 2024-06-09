import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  testimonials = [
    { quote: 'Ich hatte eine großartige Erfahrung mit Ihrem Unternehmen. Das Boot war sauber und gut gewartet, und die Abholung und Rückgabe waren mühelos.', author: 'Stanislav, Uzbekistan' },
    { quote: 'Hervorragender Service und eine große Auswahl an Booten. Absolut empfehlenswert!', author: 'Nour, Kongo' },
    { quote: 'Eine tolle Erfahrung von Anfang bis Ende. Sehr zu empfehlen!', author: 'Eyüphan, Guatamala' }
  ];

  @ViewChild('slider') slider!: ElementRef;
  index = 0;

  ngOnInit() {
    console.log('Component initialized');
    console.log('Testimonials:', this.testimonials);
    
    setInterval(() => this.showNextSlide(), 5000); // Wechselt alle 5 Sekunden zur nächsten Folie
  }

  showNextSlide() {
    console.log('Current index before update:', this.index);
    this.index++;
    if (this.index >= this.testimonials.length) {
      this.index = 0;
    }
    console.log('Current index after update:', this.index);
    this.slider.nativeElement.style.transform = `translateX(${-this.index * 100}%)`;
  }
}
