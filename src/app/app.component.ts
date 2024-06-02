import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from "./header/header.component";
import {HomeComponent} from "./home/home.component";
import {HaefenComponent} from "./haefen/haefen.component";
import {KalenderComponent} from "./kalender/kalender.component";
import {SchiffeComponent} from "./schiffe/schiffe.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, HomeComponent, HaefenComponent, KalenderComponent, SchiffeComponent, LoginComponent, RegisterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'WebDBSchiffsverleih';
}
