import { NamedAPIResource } from "./pokemon.model";

export interface EvolutionChainResponse {
  id: number;
  chain: EvolutionDetail;
  // baby_trigger_item: string | null;
}

export interface EvolutionDetail {
  species: NamedAPIResource;
  evolves_to: EvolutionDetail[];
  evolution_details: EvolutionTriggerDetail[];
}

export interface EvolutionTriggerDetail {
  trigger: NamedAPIResource;
  min_level?: number;
  item?: NamedAPIResource;
  held_item?: NamedAPIResource;
  location?: NamedAPIResource;
}

export interface EvolutionChainPokemon {
  id: number;
  name: string;
  image: string;
  url: string;
}