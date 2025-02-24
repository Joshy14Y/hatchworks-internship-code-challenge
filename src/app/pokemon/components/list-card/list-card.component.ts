import { CommonModule } from '@angular/common';
import { Component, input, OnInit, signal, inject } from '@angular/core';
import { Type } from '../../interfaces/pokeapi-pokemon.interfaces';
import { PokemonTypeService } from '../../services/pokemon-type.service';
import { Router } from '@angular/router';
import { HashZeroFormatPipe } from '../../pipes/hash-zero-format.pipe';
import { CatchButtonComponent } from "../catch-button/catch-button.component";

@Component({
  selector: 'pokemon-list-card',
  imports: [CommonModule, HashZeroFormatPipe, CatchButtonComponent],
  templateUrl: './list-card.component.html',
  styleUrl: './list-card.component.css',
})
export class ListCardComponent implements OnInit {
  private router = inject(Router);
  private pokemonTypeService = inject(PokemonTypeService);
  imgUrl = input<string | undefined>('');
  name = input.required<string>();
  number = input.required<number>();
  types = input.required<Type[]>();
  typeIcons = signal<string[]>([]);

  ngOnInit(): void {
    this.loadTypeIcons();
  }

  loadTypeIcons(): void {
    const typeIcons = this.types().map((t) =>
      this.pokemonTypeService.getTypeIcon(t.type.name)
    );
    this.typeIcons.set(typeIcons);
  }

  onClick(): void {
    this.router.navigate([`/pokemon/${this.number()}`]);
  }
}
