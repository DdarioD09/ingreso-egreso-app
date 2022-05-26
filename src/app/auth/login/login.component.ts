import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import * as uiActions from '../../shared/ui.actions';

import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  loading!: boolean;
  uiSubscription!: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.uiSubscription = this.store.select('ui').subscribe((ui) => {
      this.loading = ui.isLoading;
      console.log('cargando subs');
    });
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  loginUser() {
    if (this.loginForm.invalid) return;

    this.store.dispatch(uiActions.isLoading());

    const { email, password } = this.loginForm.value;
    // this.showLoadingAlert('Iniciando sesión');
    this.authService
      .loginUser(email, password)
      .then(() => {
        // Swal.close();
        this.store.dispatch(uiActions.stopLoading());
        this.router.navigate(['/']);
      })
      .catch((error) => this.showErrorAlert(error.message));
  }

  showLoadingAlert(message: string) {
    Swal.fire({
      title: message,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  showErrorAlert(message: string) {
    this.store.dispatch(uiActions.stopLoading());
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message,
    });
  }
}
