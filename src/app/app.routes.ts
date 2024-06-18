import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HaefenComponent } from './haefen/haefen.component';
import { KalenderComponent } from './kalender/kalender.component';
import { SchiffeComponent } from './schiffe/schiffe.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'haefen', component: HaefenComponent },
  { path: 'kalender', component: KalenderComponent },
  { path: 'schiffe', component: SchiffeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];
