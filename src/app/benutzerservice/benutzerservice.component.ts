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
}


