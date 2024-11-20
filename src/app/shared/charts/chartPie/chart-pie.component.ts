import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import ApexCharts from 'apexcharts';
import {
  ApexChart,
  ApexDataLabels,
  ApexResponsive,
  NgApexchartsModule,
} from 'ng-apexcharts';

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
  @Input() productos: any[] = [];
  public dataLoaded: boolean = false;
  private chart: ApexCharts | undefined;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeChartWithData();
      this.cdr.detectChanges();
      console.log('Productos:', this.productos);
    }
  }

  private initializeChartWithData(): void {
    const seriesData = this.productos.map((product) => product.quantity);
    const labelsData = this.productos.map((product) => product.product);

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

    this.renderChart();
  }

  private renderChart(): void {
    import('apexcharts')
      .then((ApexChartsModule) => {
        const ApexCharts = ApexChartsModule.default;
        if (this.chart) {
          this.chart.destroy();
        }
        this.chart = new ApexCharts(
          document.querySelector('#chart-pie'),
          this.options
        );
        this.chart.render().catch((error: any) => {
          console.error('Error rendering chart:', error);
        });
      })
      .catch((error: any) => {
        console.error('Error loading ApexCharts:', error);
      });
  }
}
