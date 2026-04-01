import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs/operators';
import { ImageFallbackDirective } from '../../directives/image-fallback.directive';
import { CharacterStateService } from '../../services/character-state.service';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-character-detail',
  imports: [CommonModule, RouterLink, ImageFallbackDirective],
  templateUrl: './character-detail.component.html',
  styleUrl: './character-detail.component.css',
})
export class CharacterDetailComponent {
  route = inject(ActivatedRoute);
  state = inject(CharacterStateService);
  favorites = inject(FavoritesService);
  id = toSignal(
    this.route.paramMap.pipe(map((p) => Number(p.get('id')))),
    { initialValue: NaN },
  );

  character = computed(() => {
    const id = this.id();
    return this.state.getById(id);
  });

constructor() {
    this.state.load();
  }

  toggleFavorite(id: number) {
    this.favorites.toggle(id);
  }
}
