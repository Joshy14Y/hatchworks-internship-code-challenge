import { Component, inject, OnInit, signal } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { CommonModule } from '@angular/common';
import { ListCardComponent } from "../../components/list-card/list-card.component";
import { PokemonTypeService } from '../../services/pokemon-type.service';
import { SearchBarComponent } from "../../components/searchbar/search-bar.component";
import { Router } from '@angular/router';

@Component({
  selector: 'pokemon-list-page',
  imports: [CommonModule, ListCardComponent, SearchBarComponent],
  templateUrl: './list-page.component.html',
  styleUrl: './list-page.component.css',
})
export class ListPageComponent {
  searchQuery = signal<string>('');
  private pokemonService = inject(PokemonService)

  onSearch(value: string) {
    this.searchQuery.set(value);
  }

  get filteredPokemon() {
    return this.searchQuery()
      ? this.pokemonService.searchPokemon(this.searchQuery())
      : this.pokemonService.Pokemon;
  }
}
