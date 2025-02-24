import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { PokemonSpecies } from '../interfaces/pokeapi-species.interfaces';

@Injectable({
  providedIn: 'root',
})
export class PokemonSpeciesService {
  private http = inject(HttpClient);
  private baseUrl = signal<string>(
    'https://pokeapi.co/api/v2/pokemon-species'
  ).asReadonly();

  constructor() {}

  loadPokemonSpecies(id: string | number): Observable<PokemonSpecies> {
    return this.http.get<PokemonSpecies>(`${this.baseUrl()}/${id}`);
  }
}
