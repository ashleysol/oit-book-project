import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient) { }

  getWeather(coords: string): Observable<any>{
    // Put API Key here
    let KEY: string = "";
    let url: string = `http://api.weatherstack.com/current?access_key=${KEY}&query=${coords}&units=f`;

    return this.http
               .jsonp(url, 'callback');
  }
}
