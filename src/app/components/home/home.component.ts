import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { UsuarioService } from '../../services/usuario.service';
import { ChartComponent } from '../../shared/charts/chartColumns/chart.component';
import { ChartPieComponent } from '../../shared/charts/chartPie/chart-pie.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink,CommonModule,RouterOutlet,ChartComponent,ChartPieComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  usuarios: any[] = [];
  gastos: number = 0;
  productos: any[] = [];
  productos1: any[] = [];
  stock:number = 0;
  profits:number = 0;
  net_profits:number = 0;
  productosLoaded:boolean=false;
  usuariosLoaded:boolean=false;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private usuarioService: UsuarioService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadUsuarios();
      this.loadProductos();
    }
  }

  private loadUsuarios(): void {
    this.usuarioService.getUsers().subscribe({
      next: (response) => {
        this.usuarios = response;
        this.gastos += this.usuarios.reduce((total, usuario) => total + usuario.salary, 0);
        this.usuariosLoaded = true;
        this.calculateNetProfits();
      },
      error: (error) => console.error('Error fetching users data', error),
    });
  }

  private loadProductos(): void {
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.productos = response;
        this.stock += this.productos.reduce((total, producto) => total + producto.quantity, 0);
        this.gastos += this.productos.reduce((total, producto) => total + (producto.cost * producto.quantity), 0);
        this.profits += this.productos.reduce((total, producto) => total + (producto.sale_price * producto.quantity), 0);
        this.productosLoaded = true;
        this.calculateNetProfits();
      },
      error: (error) => console.error('Error fetching products data', error),
    });
  }

  private calculateNetProfits(): void {
    if (this.usuariosLoaded && this.productosLoaded) {
      this.net_profits = this.profits - this.gastos;
    }
  }
}
