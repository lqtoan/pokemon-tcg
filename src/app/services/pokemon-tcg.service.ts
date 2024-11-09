import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Set, SetResponse } from '../models/pokemon-tcg-set.model';
import { CardResponse } from '../models/pokemon-tcg-card.model';

@Injectable({
  providedIn: 'root',
})
export class PokemonTcgService {
  private apiUrl = 'https://api.pokemontcg.io/v2';
  private API_KEY = environment.apiKey;

  constructor(private http: HttpClient) {}

  getAllSets(): Observable<SetResponse> {
    const headers = new HttpHeaders().set('X-Api-Key', this.API_KEY );
    return this.http.get<SetResponse>(`${this.apiUrl}/sets`, { headers });
  }

  getSetById(setId: string): Observable<{ data: Set }> {
    return this.http.get<{ data: Set }>(`${this.apiUrl}/sets/${setId}`);
  }

  getCardsBySet(setId: string): Observable<CardResponse> {
    const headers = new HttpHeaders().set('X-Api-Key', this.API_KEY );
    return this.http.get<CardResponse>(`${this.apiUrl}/cards?q=set.id:${setId}`, { headers });
  }
}
