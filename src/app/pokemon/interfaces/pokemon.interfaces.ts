import { PokemonEvolutionChain } from './pokeapi-evolution-chain.interfaces';
import { Pokemon, Result } from './pokeapi-pokemon.interfaces';
import { PokemonSpecies, EvolutionChain } from './pokeapi-species.interfaces';

export interface PokemonWithDetails extends Result, Pokemon {}

export interface PokemonSpeciesWithEvolutionChain extends PokemonSpecies {
  fetchedEvolutionChain: PokemonEvolutionChain
}
