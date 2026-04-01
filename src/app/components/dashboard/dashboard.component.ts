import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ImageFallbackDirective } from '../../directives/image-fallback.directive';
import { CharacterStateService } from '../../services/character-state.service';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, ScrollingModule, ImageFallbackDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  state = inject(CharacterStateService);
  favorites = inject(FavoritesService);
  destroyRef = inject(DestroyRef);
  host = inject<ElementRef<HTMLElement>>(ElementRef);
  columnCount = signal(1);
  rowHeight = 330;

  rows = computed(() =>
    this.chunkArray(this.state.filteredCharacters(), this.columnCount()),
  );

  constructor() {
    this.state.load();
    this.columnRenderer();
  }

  onSearchInput(event: Event): void {
    const v = (event.target as HTMLInputElement).value;
    this.state.setSearchInput(v);
  }

  onMovieStarsChange(event: Event): void {
    this.state.setMovieStarsOnly((event.target as HTMLInputElement).checked);
  }

  onFavoritesOnlyChange(event: Event): void {
    this.state.setFavoritesOnly((event.target as HTMLInputElement).checked);
  }

  toggleFavorite(id: number, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.favorites.toggle(id);
  }

  trackByRowIndex(index: number, _row: unknown): number {
    return index;
  }
  columnRenderer() {
    afterNextRender(() => {
      const syncLayoutFromCss = () => {
        const cs = getComputedStyle(this.host.nativeElement);
        const cols = parseInt(cs.getPropertyValue('--dashboard-cols').trim(), 10);
        this.columnCount.set(cols > 0 ? cols : 1);
      };
      syncLayoutFromCss();
      fromEvent(window, 'resize')
        .pipe(debounceTime(120), takeUntilDestroyed(this.destroyRef))
        .subscribe(syncLayoutFromCss);
    });
  }
   chunkArray(items: any, size: number): any[][] {
    if (size < 1) {
      return [];
    }
    const rows: any[][] = [];
    for (let i = 0; i < items.length; i += size) {
      rows.push(items.slice(i, i + size));
    }
    return rows;
  }
}
