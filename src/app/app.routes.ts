import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SchiffeComponent } from './schiffe/schiffe.component';
import { HaefenComponent } from './haefen/haefen.component';
import { KalenderComponent } from './kalender/kalender.component';
import { KontaktComponent } from './kontakt/kontakt.component';
import { LoginComponent} from "./login/login.component";
import { RegisterComponent} from "./register/register.component";
import { RoutenComponent} from "./routen/routen.component";
import { PreiseComponent} from "./preise/preise.component";

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'schiffe', component: SchiffeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'haefen', component: HaefenComponent },
  { path: 'kalender', component: KalenderComponent },
  { path: 'routen', component: RoutenComponent },
  { path: 'preise', component: PreiseComponent },
  { path: 'kontakt', component: KontaktComponent }
];
