import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BenutzerService {
  private apiUrl = 'http://localhost:8081/benutzer';

  constructor(private http: HttpClient) { }

  getBenutzer(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/login', credentials);
  }

  register(credentials: { username: string; password: string, surname: String, name: String}): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/register', credentials);
  }

  isLoggedIn(): boolean {
    // Überprüfen Sie den Login-Status (z.B. durch ein Token im Local Storage)
    return !!localStorage.getItem('token');
  }
}
