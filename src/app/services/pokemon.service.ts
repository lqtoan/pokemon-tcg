// src/app/services/pokemon.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pokemon, PokemonListResponse } from '../models/pokemon.model';
import { PokemonSpecies } from '../models/pokemon-species.model';
import { EvolutionChain } from '../models/evolution-chain.model';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2/';

  constructor(private http: HttpClient) {}

  getPokemonList(limit: number, offset: number): Observable<PokemonListResponse> {
    return this.http.get<PokemonListResponse>(
      `${this.baseUrl}pokemon?limit=${limit}&offset=${offset}`
    );
  }

  getPokemonData(url: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(url);
  }

  searchPokemon(name: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.baseUrl}/${name}`);
  }

  getPokemonDetails(id: number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.baseUrl}/pokemon/${id}`);
  }

  getPokemonSpecies(id: number): Observable<PokemonSpecies> {
    return this.http.get<PokemonSpecies>(`${this.baseUrl}/pokemon-species/${id}`);
  }

  getEvolutionChain(url: string): Observable<EvolutionChain> {
    return this.http.get<EvolutionChain>(url);
  }

  getIdFromUrl(url: string): number {
    const parts = url.split('/');
    return parseInt(parts[parts.length - 2]);
  }
}
