export interface DisneyCharacter {
  _id: number;
  name: string;
  imageUrl: string;
  films: string[];
  tvShows: string[];
  videoGames: string[];
}

export interface DisneyApiResponse {
  data: DisneyCharacter[];
  info?: {
    count: number;
    totalPages?: number;
    previousPage?: string | null;
    nextPage?: string | null;
  };
}
