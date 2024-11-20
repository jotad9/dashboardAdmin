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
  imports: [NgApexchartsModule, CommonModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css',
})
export class ChartComponent implements OnInit {
  @Input() productos: any[] = [];
  public dataLoaded: boolean = false;
  public chartOptions!: Partial<ChartOptions>;

  constructor(
    private cdr: ChangeDetectorRef
  ) {}

  initializeChart(): void {
    // Configuración inicial del gráfico
    this.chartOptions = {
      series: [
        {
          name: 'Expenses',
          data: [],
        },
        {
          name: 'Profits',
          data: [],
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
        width: 600,
      },
      dataLabels: {
        enabled: true,
        style: {
          fontWeight: 'bold',
        },
      },
      xaxis: {
        categories: [],
      },
    };
  }
  ngOnInit(): void {
    console.log('Productos:', this.productos);
    this.initializeChart();
    this.chartOptions.series = [
      {
        name: 'Expenses',
        data: this.productos.map(
          (producto) => producto.cost * producto.quantity
        ),
      },
      {
        name: 'Profits',
        data: this.productos.map(
          (producto) => producto.sale_price * producto.quantity
        ),
      },
    ];
    this.chartOptions.xaxis = {
      categories: this.productos.map((producto) => producto.product),
    };
    this.dataLoaded = true;
    this.cdr.detectChanges();
  }
}
