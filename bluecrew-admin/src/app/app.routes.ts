import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'usuarios', loadComponent: () => import('./pages/usuarios/usuarios.component').then(m => m.UsuariosComponent) },
  { path: 'ongs', loadComponent: () => import('./pages/ongs/ongs.component').then(m => m.OngsComponent) },
  { path: 'mensajes', loadComponent: () => import('./pages/mensajes/mensajes.component').then(m => m.MensajesComponent) },
  { path: 'eventos', loadComponent: () => import('./pages/eventos/eventos.component').then(m => m.EventosComponent) },
  { path: 'noticias', loadComponent: () => import('./pages/noticias/noticias.component').then(m => m.NoticiasComponent) },
  { path: 'categorias', loadComponent: () => import('./pages/categorias/categorias.component').then(m => m.CategoriasComponent) }
];
