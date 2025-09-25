// Interface de um filme retornado pela API:
// Obs.: Nem todos os atributos são obrigatórios
export interface Movie {
  id: number;
  title: string;
  release_date?: string;
  vote_average: number;
  runtime?: number;
  genre_ids?: number[]
  poster_path: string | null;
  overview: string;
}

// Interface para listagens de filmes:
export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

// Interface de uma pessoa (ator, diretor, etc.) retornada pela API:
export interface Person {
  id: number;
  name: string;
  known_for_department: string;
  profile_path: string | null;
}

// Interface de resposta para buscas de pessoas:
export interface PersonResponse {
  page: number;
  results: Person[];
  total_pages: number;
  total_results: number;
}

// Interface que mostra em quais filmes a pessoa trabalhou:
export interface PersonMovieCreditsResponse {
  cast: Movie[];   // Filmes em que atuou como ator/atriz
  crew: Movie[];   // Filmes em que participou em outra função
  id: number;
}
