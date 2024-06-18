import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // Importiere RouterModule für Routing
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'; // Beispiel für eine externe Bibliothek

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { HaefenComponent } from './haefen/haefen.component';
import { KalenderComponent } from './kalender/kalender.component';
import { SchiffeComponent } from './schiffe/schiffe.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HttpClientModule } from '@angular/common/http'; // Importiere HttpClientModule für HTTP-Anfragen

import { routes } from './app.routes'; // Importiere deine Routenkonfiguration

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule, 
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes), 
    FontAwesomeModule 
  ],
  providers: [],
  bootstrap: [AppComponent] 
})
export class AppModule { }
