export interface SetImages {
  symbol: string;  // URL của biểu tượng bộ thẻ
  logo: string;    // URL của logo bộ thẻ
}

export interface SetLegalities {
  unlimited: string;  // Tình trạng hợp lệ trong chế độ Unlimited
}

export interface Set {
  id: string;             // ID của bộ thẻ (e.g., "base2")
  images: SetImages;      // Dữ liệu hình ảnh (symbol, logo)
  logo: string;           // URL của logo bộ thẻ
  symbol: string;         // URL của biểu tượng bộ thẻ
  legalities: SetLegalities; // Các trạng thái hợp lệ của bộ thẻ
  unlimited: string;      // Trạng thái hợp lệ trong chế độ Unlimited
  name: string;           // Tên bộ thẻ (e.g., "Jungle")
  printedTotal: number;   // Tổng số thẻ đã in trong bộ
  ptcgoCode: string;      // Mã bộ thẻ trên Pokémon TCG Online (e.g., "JU")
  releaseDate: string;    // Ngày phát hành bộ thẻ
  series: string;         // Series của bộ thẻ (e.g., "Base")
  total: number;          // Tổng số thẻ trong bộ
  updatedAt: string;      // Thời gian cập nhật bộ thẻ
}

export interface SetResponse {
  count: number;
  data: Set[];
  page: number;
  pageSize: number;
  totalCount: number;
}