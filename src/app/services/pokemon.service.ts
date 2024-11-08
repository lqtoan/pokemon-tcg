// src/app/services/pokemon.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2/';

  constructor(private http: HttpClient) {}

  getPokemonList(limit: number, offset: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}pokemon?limit=${limit}&offset=${offset}`
    );
  }

  getPokemonData(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

  searchPokemon(name: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${name}`);
  }

  getPokemonDetails(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/pokemon/${id}`);
  }

  getPokemonSpecies(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/pokemon-species/${id}`);
  }

  getEvolutionChain(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

  getIdFromUrl(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 2];
  }
}
