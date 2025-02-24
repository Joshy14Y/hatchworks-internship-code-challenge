import { HashZeroFormatPipe } from './../../pipes/hash-zero-format.pipe';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { Pokemon } from '../../interfaces/pokeapi-pokemon.interfaces';
import { CommonModule } from '@angular/common';
import { PokemonTypeService } from '../../services/pokemon-type.service';
import { PokemonService } from '../../services/pokemon.service';
import { ActivatedRoute } from '@angular/router';
import { ConvertUnitPipe } from '../../pipes/convert-unit.pipe';
import { CatchButtonComponent } from '../catch-button/catch-button.component';
import { PokemonSpeciesService } from '../../services/pokemon-species.service';
import { CleanTextPipe } from '../../pipes/clean-text.pipe';
import { PokemonSpecies } from '../../interfaces/pokeapi-species.interfaces';

@Component({
  selector: 'pokemon-detail-card',
  imports: [
    CommonModule,
    HashZeroFormatPipe,
    ConvertUnitPipe,
    CleanTextPipe,
    CatchButtonComponent,
  ],
  templateUrl: './detail-card.component.html',
  styleUrl: './detail-card.component.css',
})
export class DetailCardComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private pokemonService = inject(PokemonService);
  private pokemonTypeService = inject(PokemonTypeService);
  private PokemonSpeciesService = inject(PokemonSpeciesService);
  private pokemonCryElementRef = viewChild<ElementRef>('pokemonCry');

  id = signal<string>('');
  pokemon = signal<Pokemon | null>(null);
  pokemonTypeIcons = signal<string[]>([]);
  pokemonDescription = signal<string>('');
  pokemonGenera = signal<string>('');

  ngOnInit(): void {
    this.route.paramMap.subscribe((p) => {
      const id = p.get('id')!;
      this.id.set(id);
      this.loadPokemon();
    });
  }

  loadPokemon(): void {
    this.pokemonService.loadPokemonDetail(this.id()!).subscribe((r) => {
      this.pokemon.set(r);
      this.loadTypeIcons();
      this.loadSpecies();
      console.log(this.pokemonDescription);
    });
  }

  loadTypeIcons(): void {
    const pokemonTypeIcons = this.pokemon()
      ? this.pokemon()!.types.map((t) =>
          this.pokemonTypeService.getTypeIcon(t.type.name)
        )
      : [];
    this.pokemonTypeIcons.set(pokemonTypeIcons);
  }

  loadSpecies(): void {
    this.PokemonSpeciesService.loadPokemonSpecies(this.id()).subscribe((s) => {
      this.setPokemonDescription(s);
      this.setPokemonGenera(s);
    });
  }

  private setPokemonDescription(species: PokemonSpecies): void {
    const heartgoldEntry = species.flavor_text_entries.find(
      (e) => e.version.name === 'heartgold'
    );
    heartgoldEntry ? this.pokemonDescription.set(heartgoldEntry.flavor_text) : null;
  }

  private setPokemonGenera(species: PokemonSpecies): void {
    const enGenera = species.genera.find((e) => e.language.name === 'en');
    enGenera ? this.pokemonGenera.set(enGenera.genus) : null;
  }

  get officialArtworkUrl() {
    return this.pokemon()?.sprites.other?.['official-artwork']?.front_default;
  }

  playAudio(): void {
    this.pokemonCryElementRef()!.nativeElement.play();
  }
}
