import { NamedAPIResource } from "./pokemon.model";

export interface EvolutionChain {
  id: number;
  chain: EvolutionDetail;
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
  // Có thể bổ sung thêm các yếu tố khác như min_happiness, min_beauty, etc.
}

export interface EvolutionChainPokemon {
  id: number;
  name: string;
  image: string;
  url: string;
}