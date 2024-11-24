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
  public optionsLeft!: Partial<ChartOptions>;
  public optionsRight!: Partial<ChartOptions>;
  @Input() productos: any[] = [];
  public dataLoaded: boolean = false;
  private chartLeft: ApexCharts | undefined;
  private chartRight: ApexCharts | undefined;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeChartWithData();
      this.initializeChartWithDataRight();
      this.cdr.detectChanges();
      console.log('Productos:', this.productos);
    }
  }

  private initializeChartWithData(): void {
    const seriesData = this.productos.map((product) => product.quantity);
    const labelsData = this.productos.map((product) => product.product);

    this.optionsLeft = {
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

    this.renderChartLeft();
  }

  private initializeChartWithDataRight(): void {
    const seriesData = this.productos.map((product) => product.sold);
    const labelsData = this.productos.map((product) => product.product);

    this.optionsRight = {
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

    this.renderChartRight();
  }
  private renderChartLeft(): void {
    import('apexcharts')
      .then((ApexChartsModule) => {
        const ApexCharts = ApexChartsModule.default;
        if (this.chartLeft) {
          this.chartLeft.destroy();
        }
        this.chartLeft = new ApexCharts(
          document.querySelector('#chart-pieLeft'),
          this.optionsLeft
        );
        this.chartLeft.render().catch((error: any) => {
          console.error('Error rendering chart:', error);
        });
      })
      .catch((error: any) => {
        console.error('Error loading ApexCharts:', error);
      });
  }

  private renderChartRight(): void {
    import('apexcharts')
      .then((ApexChartsModule) => {
        const ApexCharts = ApexChartsModule.default;
        if (this.chartRight) {
          this.chartRight.destroy();
        }
        this.chartRight = new ApexCharts(
          document.querySelector('#chart-pieRight'),
          this.optionsRight
        );
        this.chartRight.render().catch((error: any) => {
          console.error('Error rendering chart:', error);
        });
      })
      .catch((error: any) => {
        console.error('Error loading ApexCharts:', error);
      });
  }
}
