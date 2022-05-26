import { Injectable } from '@angular/core';
import { map, Subscription } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Store } from '@ngrx/store';
import { User } from '../models/user.model';

import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userSubscription!: Subscription;

  constructor(
    public auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private store: Store<AppState>
  ) {}

  initAuthListener() {
    this.auth.authState.subscribe((firebaseUser) => {
      if (firebaseUser) {
        this.userSubscription = this.firestore
          .doc(`${firebaseUser?.uid}/user`)
          .valueChanges()
          .subscribe((firestoreUser) => {
            console.log(firestoreUser);
            const user = User.fromFirestore(firestoreUser);
            this.store.dispatch(authActions.setUser({ user }));
          });
      } else {
        if (this.userSubscription) this.userSubscription.unsubscribe();
        this.store.dispatch(authActions.unSetUser());
      }
    });
  }

  async createUser(name: string, email: string, password: string) {
    return this.auth
      .createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        const newUser = new User(user?.uid, name, user?.email);
        return this.firestore.doc(`${user?.uid}/user`).set({ ...newUser });
      });
  }

  loginUser(email: string, password: string): Promise<any> {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe(
      map((firebaseUser) => firebaseUser != null)
    );
  }
}
