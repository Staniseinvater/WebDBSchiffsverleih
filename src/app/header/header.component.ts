import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BenutzerService } from '../benutzerservice/benutzerservice.component';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  menuOpen = false;
  isLoggedIn: boolean = false;
  userName: string = '';
  private loginSubscription: Subscription;
  private userNameSubscription: Subscription;

  constructor(private benutzerService: BenutzerService) {
    this.loginSubscription = new Subscription();
    this.userNameSubscription = new Subscription();
  }

  ngOnInit() {
    this.userName = localStorage.getItem('userName') || 'Benutzer';
    this.loginSubscription = this.benutzerService.isLoggedIn$.subscribe(
      loggedIn => {
        this.isLoggedIn = loggedIn;
      }
    );

    this.userNameSubscription = this.benutzerService.userName$.subscribe(
      name => {
        this.userName = name;
      }
    );
  }

  ngOnDestroy() {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
    if (this.userNameSubscription) {
      this.userNameSubscription.unsubscribe();
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }
}