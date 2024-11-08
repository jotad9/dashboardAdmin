import { Component, Input, OnInit } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexXAxis,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { ProductService } from '../../services/product.service';

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
  imports: [NgApexchartsModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css',
})
export class ChartComponent implements OnInit {
  @Input() productos: any[] = [];

  public chartOptions: Partial<ChartOptions>;

  constructor(private productService: ProductService) {
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
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.productos = response;

        this.chartOptions.series![0].data = this.productos.map(
          (producto) => (producto.cost*producto.quantity)
        );
        this.chartOptions.series![1].data = this.productos.map(
          (producto) => (producto.sale_price*producto.quantity)
        );
        this.chartOptions.xaxis!.categories = this.productos.map(
          (producto) => producto.product
        );
      },
      error: (error) => console.error('Error fetching data', error),
    });
  }
}
