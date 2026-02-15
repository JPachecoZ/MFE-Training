import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'mapa',
    loadChildren: () => loadRemoteModule('mapa', './Routes')
      .then(m => m.MAPA_ROUTES)
  }
];
