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
  profileMenuOpen = false;
  isLoggedIn: boolean = false;
  userName: string = '';
  private subscription: Subscription = new Subscription();

  constructor(private benutzerService: BenutzerService) { }

  ngOnInit() {
    this.subscription.add(
      this.benutzerService.isLoggedIn$.subscribe(loggedIn => {
        this.isLoggedIn = loggedIn;
        if (!loggedIn) {
          this.userName = '';
          this.profileMenuOpen = false;
        }
      })
    );

    this.subscription.add(
      this.benutzerService.userName$.subscribe(name => {
        this.userName = name;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    if (this.menuOpen) {
      this.profileMenuOpen = false;
    }
  }

  toggleProfileMenu() {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
    this.profileMenuOpen = false;
  }

  logout() {
    this.benutzerService.logout();
    this.closeMenu();
  }
}