import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import ApexCharts from 'apexcharts';
import {
  ApexChart,
  ApexDataLabels,
  ApexResponsive,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { ProductService } from '../../../services/product.service';

export type ChartOptions = {
  series: number[];
  chart: ApexChart;
  labels: string[];
  dataLabels: ApexDataLabels;
  responsive: ApexResponsive[];
};

@Component({
  selector: 'app-chart-pie',
  standalone: true,
  imports: [NgApexchartsModule, CommonModule],
  templateUrl: './chart-pie.component.html',
  styleUrls: ['./chart-pie.component.css'],
})
export class ChartPieComponent implements OnInit {
  public options!: Partial<ChartOptions>;
  @Input() productos1: any[] = [];
  public dataLoaded:boolean = false;
  private chart: ApexCharts | undefined;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private productService: ProductService, private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.productService.getProducts().subscribe({
        next: (response) => {
          this.productos1 = response;

          // Verificar que los datos se están cargando correctamente
          console.log('Productos:', this.productos1);

          // Actualiza las opciones del gráfico después de cargar los datos
          const seriesData = this.productos1.map((product) => product.quantity);
          const labelsData = this.productos1.map((product) => product.product);

          // Verificar que los datos para el gráfico son correctos
          console.log('Series Data:', seriesData);
          console.log('Labels Data:', labelsData);

          // Inicializar el gráfico con los datos
          this.options = {
            series: seriesData,
            chart: {
              type: 'donut',
              width: 400,
              height: 200,
            },
            labels: labelsData,
            dataLabels: {
              enabled: true,
              style: {
                fontWeight: 'bold',
              },
            },
            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: {
                    width: 300,
                  },
                  legend: {
                    position: 'bottom',
                  },
                },
              },
            ],
          };

          // Renderizar el gráfico
          import('apexcharts').then((ApexChartsModule) => {
            const ApexCharts = ApexChartsModule.default;
            this.chart = new ApexCharts(document.querySelector('#chart'), this.options);
            this.chart.render();
          });

          this.dataLoaded = true;
          // Forzar la detección de cambios
          this.cdr.detectChanges();
        },
        error: (error) => console.error('Error fetching products data', error),
      });
    }
  }
}
