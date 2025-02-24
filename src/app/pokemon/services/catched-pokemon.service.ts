import { Injectable, Inject, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CatchedPokemonService {
  private storageKey = signal<string>('catchedPokemon').asReadonly();
  private platformId = inject(PLATFORM_ID);

  private getCatchedPokemon(): number[] {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const storedData = localStorage.getItem(this.storageKey());
        return storedData ? JSON.parse(storedData) : [];
      } catch (e) {
        console.error(
          'Error parsing catchedPokemon data from localStorage:',
          e
        );
        return [];
      }
    }
    return [];
  }

  addCatchedPokemon(id: number): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const currentCatched = this.getCatchedPokemon();
        if (!this.isCatched(id)) {
          currentCatched.push(id);
          this.saveCatchedPokemon(currentCatched);
        }
      } catch (e) {
        console.error('Error adding catched pokemon:', e);
      }
    }
  }

  removeCatchedPokemon(id: number): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        let currentCatched = this.getCatchedPokemon();
        currentCatched = currentCatched.filter((pokemonId) => pokemonId !== id);
        this.saveCatchedPokemon(currentCatched);
      } catch (e) {
        console.error('Error removing catched pokemon:', e);
      }
    }
  }

  isCatched(id: number): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const catchedPokemon = this.getCatchedPokemon();
      return catchedPokemon.includes(id);
    }
    return false;
  }

  private saveCatchedPokemon(ids: number[]): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(this.storageKey(), JSON.stringify(ids));
      } catch (e) {
        console.error('Error saving catched pokemon to localStorage:', e);
      }
    }
  }
}
