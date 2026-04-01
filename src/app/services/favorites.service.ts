import { Injectable, computed, signal } from '@angular/core';

const STORAGE_KEY = 'disney-archive-favorites';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  ids = signal<ReadonlySet<number>>(this.readFromStorage());

  favoriteIds = this.ids.asReadonly();

  count = computed(() => this.ids().size);

  isFavorite(id: number): boolean {
    return this.ids().has(id);
  }

  toggle(id: number) {
    const next = new Set(this.ids());
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    this.ids.set(next);
    this.persist(next);
  }

  readFromStorage(): ReadonlySet<number> {
   return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'));
  }

  persist(set: Set<number>) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
    } catch {
      console.error('Failed to persist favorites');
    }
  }
}
