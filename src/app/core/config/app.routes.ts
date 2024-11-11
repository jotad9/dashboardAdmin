import { Routes } from '@angular/router';
import { HomeComponent } from '../../components/home/home.component';
import { LoginComponent } from '../../components/login/login.component';
import { RegisterComponent } from '../../components/register/register.component';
import { DashboardComponent } from '../../dashboard/dashboard.component';
export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,  // Asegúrate de tener un componente de login
  },
  {
    path: 'register',
    component: RegisterComponent,  // Asegúrate de tener un componente de login
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    //canActivate: [AuthGuard],  // Protección de ruta con el guardia
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('../../components/usuarios/usuarios.component').then(
            (m) => m.UsuariosComponent
          ),
      },
      {
        path: 'productos',
        loadComponent: () =>
          import('../../components/productos/productos.component').then(
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
        redirectTo: 'home',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'login',  // Redirige al login si no hay ruta
    pathMatch: 'full',
  },
  // Ruta para 404
  {
    path: '**',
    redirectTo: 'login',
  },
];
