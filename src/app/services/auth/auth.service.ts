import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '@models/user.model';

const SESSION_KEY = 'User';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);

  #isAuth = signal<boolean>(false);
  isAuth = this.#isAuth.asReadonly();

  #user = signal<User | null>(null);
  user = this.#user.asReadonly();

  constructor() {
    this.loadUser();
  }

  loadUser() {
    const json = localStorage.getItem(SESSION_KEY);
    if (json) {
      const user = JSON.parse(json);
      this.#user.set(user);
      this.#isAuth.set(true);
    }
  }

  saveUser(user: User) {
    this.#user.set(user);
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    this.#isAuth.set(true);
  }

  clearToken() {
    localStorage.removeItem(SESSION_KEY);
    this.#user.set(null);
    this.#isAuth.set(false);
  }
}
