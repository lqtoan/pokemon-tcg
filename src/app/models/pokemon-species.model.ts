import { NamedAPIResource } from "./pokemon.model";

export interface PokemonSpecies {
  id: number;
  name: string;
  evolution_chain: { url: string };
  flavor_text_entries: FlavorTextEntry[];
  habitat: NamedAPIResource | null;
  is_legendary: boolean;
  is_mythical: boolean;
}

export interface FlavorTextEntry {
  flavor_text: string;
  language: NamedAPIResource;
  version: NamedAPIResource;
}
