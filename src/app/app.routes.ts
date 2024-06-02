import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SchiffeComponent } from './schiffe/schiffe.component';
import { HaefenComponent } from './haefen/haefen.component';
import { KalenderComponent } from './kalender/kalender.component';
import { KontaktComponent } from './kontakt/kontakt.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'schiffe', component: SchiffeComponent },
  { path: 'haefen', component: HaefenComponent },
  { path: 'kalender', component: KalenderComponent },
  { path: 'kontakt', component: KontaktComponent }
];
