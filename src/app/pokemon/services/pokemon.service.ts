import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Response, Pokemon } from '../interfaces/pokeapi-pokemon.interfaces';
import { forkJoin, Observable, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PokemonService {
  private http = inject(HttpClient);
  private baseUrl = signal<string>(
    'https://pokeapi.co/api/v2/pokemon'
  ).asReadonly();
  private cachedPokemon = signal<Pokemon[]>([]);

  constructor() {
    this.loadPokemonWithDetails();
  }

  loadPokemon(): Observable<Response> {
    return this.http.get<Response>(this.baseUrl(), {
      params: {
        generation: 1,
        limit: 151,
      },
    });
  }

  loadPokemonDetail(id: number | string): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.baseUrl()}/${id}`);
  }

  private loadPokemonWithDetails(): void {
    this.loadPokemon()
      .pipe(
        switchMap((response) =>
          forkJoin(
            response.results.map((p) =>
              this.http.get<Pokemon>(p.url)
            )
          )
        )
      )
      .subscribe((pokemon) => this.cachedPokemon.set(pokemon));
  }

  get Pokemon(): Pokemon[] {
    return this.cachedPokemon();
  }

  searchPokemon(query: string): Pokemon[] {
    return this.cachedPokemon().filter((pokemon) =>
      pokemon.name.toLowerCase().includes(query.toLowerCase())
    );
  }
}
