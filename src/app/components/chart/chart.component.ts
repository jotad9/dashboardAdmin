import { Component, Input, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType, LabelItem } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';


@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})
export class ChartComponent implements OnInit {
    @Input() productos: any[] = [];

    public barChartOptions: ChartOptions = {
      responsive: true,
    };
    public barChartLabels: LabelItem[] = [];
    public barChartType: ChartType = 'bar';
    public barChartLegend = true;
    public barChartPlugins = [];

    public barChartData: ChartDataset[] = [
      { data: [], label: 'Gastos' },
      { data: [], label: 'Ingresos' }
    ];

    ngOnInit(): void {
      this.barChartLabels = this.productos.map(producto => producto.product);
      this.barChartData[0].data = this.productos.map(producto => producto.cost);
      this.barChartData[1].data = this.productos.map(producto => producto.sale_price);
    }
  }

