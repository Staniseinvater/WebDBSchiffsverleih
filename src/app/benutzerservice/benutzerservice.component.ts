import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Schiff } from '../models/schiff.model';

@Injectable({
  providedIn: 'root'
})
export class BenutzerService {
  private apiUrl = 'http://localhost:8081/benutzer';
  private apiUrl1 = 'http://localhost:8081/schiffe';
  private apiUrl2 = 'http://localhost:8081/haefen';
  private commentsUrl = 'http://localhost:8081/comments';
  isLoggedInStatus = false;


  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getBenutzer(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getSchiffe(): Observable<Schiff[]> {
    return this.http.get<Schiff[]>(this.apiUrl1, { headers: this.getAuthHeaders() });
  }

  getHaefen(): Observable<any> {
    return this.http.get<any>(this.apiUrl2, { headers: this.getAuthHeaders() });
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/login', credentials);
  }

  logout() {
    localStorage.removeItem('token');
    this.isLoggedInStatus = false;
  }

  register(credentials: { username: string; password: string, surname: string, name: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/register', credentials);
  }

  updateSchiffHafen(schiffId: number, zielHafenId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl1}/${schiffId}/hafen`, { zielHafenId }, { headers: this.getAuthHeaders() });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  addAusleihen(bookingData: any): Observable<any> {
    return this.http.post<any>('http://localhost:8081/ausleihen', bookingData, { headers: this.getAuthHeaders() });
  }

  getComments(): Observable<any[]> {
    return this.http.get<any[]>(this.commentsUrl);
  }

  addComment(comment: { author: string, location: string, text: string }): Observable<any> {
    return this.http.post<any>(this.commentsUrl, comment, { 
      headers: this.getAuthHeaders(), 
      responseType: 'text' as 'json' 
    });
  }

}
