import { EvolutionChainResponse } from "./evolution-chain.model";
import { PokemonSpecies } from "./pokemon-species.model";
import { Pokemon } from "./pokemon.model";

export interface CompletePokemonDetails {
  pokemon: Pokemon;
  species: PokemonSpecies;
  evolutionChain: EvolutionChainResponse;
}
