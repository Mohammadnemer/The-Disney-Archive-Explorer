import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { DisneyApiResponse, DisneyCharacter } from '../models/disney-character.model';

const API_URL = 'https://api.disneyapi.dev/character?pageSize=10000';

@Injectable({ providedIn: 'root' })
export class DisneyApiService {
  private http = inject(HttpClient);

  getCharacters(): Observable<DisneyCharacter[]> {
    return this.http.get<DisneyApiResponse>(API_URL).pipe(
      map((res) =>
        (res.data ?? []).map((character) => ({
          _id: character._id,
          name: character.name ?? 'Unknown',
          imageUrl: character.imageUrl ?? '',
          films: Array.isArray(character.films) ? character.films : [],
          tvShows: Array.isArray(character.tvShows) ? character.tvShows : [],
          videoGames: Array.isArray(character.videoGames) ? character.videoGames : [],
        })),
      ),
    );
  }
}
