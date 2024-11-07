import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { UsuarioService } from '../../services/usuario.service';
import { ChartComponent } from '../chart/chart.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink,CommonModule,RouterOutlet,ChartComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  usuarios: any[] = [];
  gastos: number = 0;
  productos: any[] = [];
  stock:number = 0;
  profits:number = 0;
  net_profits:number = 0;
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private usuarioService: UsuarioService, private productService: ProductService) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.usuarioService.getUsers().subscribe({
        next: (response) => {
          this.usuarios = response;

          // Es una funcion acumulativa donde total va guardando todo como cuando haces +=, el 0 es el valor inicial de total
          this.gastos += this.usuarios.reduce((total, usuario) => total + usuario.salary, 0);
        },
        error: (error) => console.error('Error fetching data', error),
      });
      this.productService.getProducts().subscribe({
        next: (response)=>{
          this.productos = response;

          this.stock += this.productos.reduce((total, producto) => total + producto.quantity, 0);

          this.gastos += this.productos.reduce((total, producto) => total + (producto.cost*producto.quantity), 0);

          this.profits += this.productos.reduce((total, producto) => total + (producto.sale_price*producto.quantity), 0);

          this.net_profits = this.profits - this.gastos;
        },
        error: (error) => console.error('Error fetching data', error),
      });
    }
  }
}
