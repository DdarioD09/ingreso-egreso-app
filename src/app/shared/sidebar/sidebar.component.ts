import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import Swal from 'sweetalert2';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [],
})
export class SidebarComponent implements OnInit, OnDestroy {
  activeUser!: string;
  userSubs!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.userSubs = this.store.select('user').subscribe(({ user }) => {
      this.activeUser = user.name;
    });
  }

  ngOnDestroy(): void {
    this.userSubs.unsubscribe();
  }

  logout() {
    this.showLoadingAlert('Cerrando sesión');
    this.authService.logout().then(() => {
      Swal.close();
      this.router.navigate(['/login']);
    });
  }

  showLoadingAlert(message: string) {
    Swal.fire({
      title: message,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }
}
