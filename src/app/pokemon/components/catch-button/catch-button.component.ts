import { CommonModule } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { CatchedPokemonService } from '../../services/catched-pokemon.service';

@Component({
  selector: 'pokemon-catch-button',
  imports: [CommonModule],
  templateUrl: './catch-button.component.html',
  styleUrl: './catch-button.component.css',
})
export class CatchButtonComponent {
  id = input.required<number>();
  isCatched = signal<boolean>(false);

  private catchedPokemonService = inject(CatchedPokemonService);

  ngOnInit() {
    this.checkIfCatched();
  }

  checkIfCatched() {
   const catched = this.catchedPokemonService.isCatched(this.id());
    this.isCatched.set(catched);
  }

  toggleCatch() {
    this.isCatched()
      ? (this.catchedPokemonService.removeCatchedPokemon(this.id()),
        this.isCatched.set(false))
      : (this.catchedPokemonService.addCatchedPokemon(this.id()),
        this.isCatched.set(true));
  }
}
