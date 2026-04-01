import { Injectable, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject, debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';
import { DisneyCharacter } from '../models/disney-character.model';
import { DisneyApiService } from './disney-api.service';
import { FavoritesService } from './favorites.service';

@Injectable({ providedIn: 'root' })
export class CharacterStateService {
  private api = inject(DisneyApiService);
  private favorites = inject(FavoritesService);
  private searchSubject = new Subject<string>();

  searchTerm = toSignal(
    this.searchSubject.pipe(
      map((q) => q.trim()),
      debounceTime(280),
      distinctUntilChanged(),
      startWith(''),
    ),
    { initialValue: '' },
  );

  characters = signal<DisneyCharacter[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  movieStarsOnly = signal(false);
  favoritesOnly = signal(false);

  filteredCharacters = computed(() => {
    const list = this.characters();
    const value = this.searchTerm().toLowerCase();
    const moviesOnly = this.movieStarsOnly();
    const favOnly = this.favoritesOnly();
    const favIds = this.favorites.favoriteIds();

    return list.filter((c) => {
      if (moviesOnly && c.films.length === 0) {
        return false;
      }
      if (favOnly) {
        if (favIds.size === 0) {
          return false;
        }
        if (!favIds.has(c._id)) {
          return false;
        }
      }
      if (value.length > 0 && !c.name.toLowerCase().includes(value)) {
        return false;
      }
      return true;
    });
  });

  setSearchInput(value: string) {
    this.searchSubject.next(value);
  }

  setMovieStarsOnly(value: boolean) {
    this.movieStarsOnly.set(value);
  }

  setFavoritesOnly(value: boolean) {
    this.favoritesOnly.set(value);
  }

  load() {
    if (this.loading() || this.characters().length > 0) {
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    this.api.getCharacters().subscribe({
      next: (data) => {
        this.characters.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load characters. Please try again later.');
        this.loading.set(false);
      },
    });
  }

  getById(id: number): DisneyCharacter | undefined {
    return this.characters().find((c) => c._id === id);
  }
}
