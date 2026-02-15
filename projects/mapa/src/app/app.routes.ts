import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./mapa/mapa.routes').then(m => m.MAPA_ROUTES)
  }
];
