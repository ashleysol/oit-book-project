import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private apiUrl = 'http://localhost:3000/api'; // Backend base URL

  constructor(private http: HttpClient) {}

  // Add a new user
  addUser(user: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, user);
  }
}

// check user/email/pass for login