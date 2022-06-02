import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AppState } from '../app.reducer';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import * as uiActions from '../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [],
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {
  ingresoEgresoForm!: FormGroup;
  tipo: string = 'ingreso';
  loading: boolean = false;
  uiSubscription!: Subscription;

  constructor(
    private formbuilder: FormBuilder,
    private ingresoEgresoService: IngresoEgresoService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.uiSubscription = this.store
      .select('ui')
      .subscribe(({ isLoading }) => (this.loading = isLoading));
    this.ingresoEgresoForm = this.formbuilder.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required],
    });
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe;
  }

  save() {
    if (this.ingresoEgresoForm.invalid) return;
    this.store.dispatch(uiActions.isLoading());
    const { descripcion, monto } = this.ingresoEgresoForm.value;
    const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo);
    this.ingresoEgresoService
      .createIngresoEgreso(ingresoEgreso)
      .then(() => {
        this.ingresoEgresoForm.reset();
        this.store.dispatch(uiActions.stopLoading());
        Swal.fire('Registro creado', descripcion, 'success');
      })
      .catch((err: any) => {
        this.store.dispatch(uiActions.stopLoading());
        Swal.fire('Error', err.message, 'error');
      });
  }
}
