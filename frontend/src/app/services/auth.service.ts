import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private localStorage: LocalStorageService,
  ) { }

  isAuthenticated(): boolean {
    const token = this.localStorage.getData('token');
    if (token) {
      return true;
    }
    return false;
  }

}
