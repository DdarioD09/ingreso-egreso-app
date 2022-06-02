import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, Subscription } from 'rxjs';
import { AppState } from '../app.reducer';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [],
})
export class DashboardComponent implements OnInit, OnDestroy {
  constructor(
    private store: Store<AppState>,
    private ingresoEgresoService: IngresoEgresoService
  ) {}
  userSubs!: Subscription;
  ingresoEgresoSubs!: Subscription;

  ngOnInit(): void {
    this.userSubs = this.store
      .select('user')
      .pipe(filter((auth) => auth.user != null))
      .subscribe(({ user }) => {
        this.ingresoEgresoSubs = this.ingresoEgresoService
          .initIngresosEgresosListener(user.uid)
          .subscribe((ingresoEgresoFB) => {
            this.store.dispatch(
              ingresoEgresoActions.setItems({ items: ingresoEgresoFB })
            );
          });
      });
  }

  ngOnDestroy(): void {
    this.userSubs?.unsubscribe();
    this.ingresoEgresoSubs?.unsubscribe();
  }
}
