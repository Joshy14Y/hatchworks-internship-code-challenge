import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { forkJoin, Observable, switchMap } from 'rxjs';
import { PokemonType, Response } from '../interfaces/pokeapi-types.interfaces';

@Injectable({
  providedIn: 'root',
})
export class PokemonTypeService {
  private http = inject(HttpClient);
  private baseUrl = signal<string>('https://pokeapi.co/api/v2/type').asReadonly();
  private cachedPokemonTypes = signal<PokemonType[]>([]);

  constructor() {
    this.loadPokemonTypesWithDetails();
  }

  loadPokemonTypes(): Observable<Response> {
    return this.http.get<Response>(this.baseUrl());
  }

  loadPokemonTypesWithDetails(): void {
    this.loadPokemonTypes()
      .pipe(
        switchMap((response) =>
          forkJoin(
            response.results.map((t) => this.http.get<PokemonType>(t.url))
          )
        )
      )
      .subscribe((types) => this.cachedPokemonTypes.set(types));
  }

  get PokemonTypes(): PokemonType[] {
    return this.cachedPokemonTypes();
  }

  getType(name: string): PokemonType | undefined {
    return this.cachedPokemonTypes().find((t) => t.name === name);
  }

  getTypeIcon(name: string): string {
    const type = this.getType(name);
    return type?.sprites['generation-vi']['omega-ruby-alpha-sapphire'].name_icon ?? ''
  }
}
