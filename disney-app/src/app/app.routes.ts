import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'character/:id',
    loadComponent: () =>
      import('./components/character-detail/character-detail.component').then(
        (m) => m.CharacterDetailComponent,
      ),
  },
  { path: '**', redirectTo: '' },
];
