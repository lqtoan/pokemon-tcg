export interface SetImages {
  symbol: string;
  logo: string;
}

export interface SetLegalities {
  unlimited: string;  // Tình trạng hợp lệ trong chế độ Unlimited
}

export interface Set {
  id: string;
  images: SetImages;
  logo: string;
  symbol: string;
  legalities: SetLegalities;
  unlimited: string;
  name: string;
  printedTotal: number;
  ptcgoCode: string;
  releaseDate: string;
  series: string;
  total: number;
  updatedAt: string;
}

export interface SetResponse {
  count: number;
  data: Set[];
  page: number;
  pageSize: number;
  totalCount: number;
}