import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexXAxis,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { ProductService } from '../../../services/product.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  dataLabels: ApexDataLabels;
};
@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [NgApexchartsModule,CommonModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css',
})
export class ChartComponent implements OnInit {
  @Input() productos: any[] = [];
  public dataLoaded: boolean = false;
  public chartOptions!: Partial<ChartOptions>;

  constructor(private productService: ProductService, private cdr: ChangeDetectorRef) { }

  initializeChart(): void {
    // Configuración inicial del gráfico
    this.chartOptions = {
      series: [
        {
          name: 'Expenses',
          data: []
        },
        {
          name: 'Profits',
          data: []
        }
      ],
      chart: {
        type: 'bar',
        height: 350,
        width: 600,

      },
      dataLabels: {
        enabled: true,
        style: {
          fontWeight: 'bold'
        }
      },
      xaxis: {
        categories: [],
      },
    };
  }
  ngOnInit(): void {
    this.initializeChart();
    // Llamada al servicio para obtener los productos y actualizar el gráfico
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.productos = response;

        // Actualiza las opciones del gráfico después de cargar los datos
        this.chartOptions.series = [
          {
            name: 'Expenses',
            data: this.productos.map((producto) => producto.cost * producto.quantity),
          },
          {
            name: 'Profits',
            data: this.productos.map((producto) => producto.sale_price * producto.quantity),
          },
        ];
        this.chartOptions.xaxis = {
          categories: this.productos.map((producto) => producto.product),
        };
        this.dataLoaded = true;
        // Forzar la detección de cambios
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Error fetching data', error),
    });
  }
}
