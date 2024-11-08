import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PokemonTcgService {
  private apiUrl = 'https://api.pokemontcg.io/v2';
  private API_KEY = environment.apiKey;

  constructor(private http: HttpClient) {}

  getPokemonCards(): Observable<any> {
    const headers = new HttpHeaders().set('X-Api-Key', this.API_KEY );
    return this.http.get(`${this.apiUrl}/cards`, { headers } );
  }

  getAllSets(): Observable<any> {
    const headers = new HttpHeaders().set('X-Api-Key', this.API_KEY );
    return this.http.get(`${this.apiUrl}/sets`, { headers });
  }

  getSetById(setId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/sets/${setId}`);
  }

  getCardsBySet(setId: string): Observable<any> {
    const headers = new HttpHeaders().set('X-Api-Key', this.API_KEY );
    return this.http.get(`${this.apiUrl}/cards?q=set.id:${setId}`, { headers });
  }
}
