import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./components/usuarios/usuarios.component').then(
            (m) => m.UsuariosComponent
          ),
      },
      {
        path: 'productos',
        loadComponent: () =>
          import('./components/productos/productos.component').then(
            (m) => m.ProductosComponent
          ),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'home'
      },
    ],
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  //sirve para redirigir a la pagina principal si no se encuentra la ruta tipico error de 404 solucionado con path: '**'
  {
    path: '**',
    redirectTo: 'dashboard'
  },
];
