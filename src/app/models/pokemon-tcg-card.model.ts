export interface Card {
  id: string; // Unique ID of the card
  name: string; // Name of the Pokémon
  images: {
    small: string; // URL of the small image of the card
    large: string; // URL of the large image of the card
  };
  types: string[]; // Types of the Pokémon (e.g., "Fire", "Water")
  hp: string; // HP (Hit Points)
  attack: {
    name: string;
    cost: string[]; // Cost of attack (e.g., energy cards)
    damage: string;
    text: string; // Description of the attack
  }[];
  rarity: string; // Rarity of the card (e.g., "Rare", "Uncommon")
  set: {
    id: string; // ID of the set the card belongs to
    name: string; // Name of the set
  };
  abilities: {
    name: string;
    text: string;
  }[]; // Special abilities the Pokémon has
  evolutions: {
    id: string;
    name: string;
    image: string;
  }[]; // Evolution information, if the Pokémon can evolve
}

export interface CardResponse {
  data: Card[]; // List of Pokémon cards matching the search criteria
  count: number; // Total number of cards matching the search
  totalCount: number;
  page: number; // Current page of results
  pageSize: number; // Number of cards per page
}
