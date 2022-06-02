import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import * as uiActions from '../../shared/ui.actions';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [],
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm!: FormGroup;
  loading!: boolean;
  uiSubscription!: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.uiSubscription = this.store
      .select('ui')
      .subscribe((ui) => (this.loading = ui.isLoading));
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  createUser() {
    if (this.registerForm.invalid) return;
    this.store.dispatch(uiActions.isLoading());
    const { name, email, password } = this.registerForm.value;
    this.authService
      .createUser(name, email, password)
      .then(() => {
        this.store.dispatch(uiActions.stopLoading());
        this.router.navigate(['/']);
      })
      .catch((error) => this.showErrorAlert(error.message));
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
