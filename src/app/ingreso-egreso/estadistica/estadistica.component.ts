import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ChartData, ChartEvent, ChartType } from 'chart.js';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: [],
})
export class EstadisticaComponent implements OnInit, OnDestroy {
  ingresos: number = 0;
  egresos: number = 0;

  totalIngresos: number = 0;
  totalEgresos: number = 0;

  itemsSubs!: Subscription;

  // Doughnut
  public doughnutChartLabels: string[] = ['Egresos', 'Ingresos'];
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [],
  };

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.select('ingresosEgresos').subscribe(({ items }) => {
      this.generarEstadistica(items);
    });
  }

  ngOnDestroy(): void {
    // this.itemsSubs.unsubscribe();
  }

  generarEstadistica(items: IngresoEgreso[]) {
    this.ingresos = 0;
    this.egresos = 0;
    this.totalIngresos = 0;
    this.totalEgresos = 0;

    if (items.length !== 0) {
      items.forEach((item) => {
        if (item.tipo === 'ingreso') {
          this.totalIngresos += item.monto;
          this.ingresos++;
        } else {
          this.totalEgresos += item.monto;
          this.egresos++;
        }
      });
      this.doughnutChartData.datasets.push({
        data: [this.totalEgresos, this.totalIngresos],
      });
    }
  }
}
