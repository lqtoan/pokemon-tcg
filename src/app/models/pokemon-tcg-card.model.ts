export interface Card {
  id: string;
  name: string;
  images: {
    small: string;
    large: string;
  };
  types: string[];
  hp: string;
  attack: {
    name: string;
    cost: string[];
    damage: string;
    text: string;
  }[];
  rarity: string;
  set: {
    id: string;
    name: string;
  };
  abilities: {
    name: string;
    text: string;
  }[];
  evolutions: {
    id: string;
    name: string;
    image: string;
  }[];
}

export interface CardResponse {
  data: Card[];
  count: number;
  totalCount: number;
  page: number;
  pageSize: number;
}
