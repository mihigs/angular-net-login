import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { FilterUserDto } from '../interfaces/filter-user-dto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private apiService: ApiService) {}

  login(loginData: any): Observable<any> {
    return this.apiService.post('/User/login', loginData);
  }

  getAllUsers(): Observable<any[]> {
    return this.apiService.get('/User/allUsers');
  }

  filterUsers(model: FilterUserDto): Observable<any> {
    return this.apiService.post('/User/filterUsers', model);
  }

  newUser(model: any): Observable<any> {
    return this.apiService.post('/User/newUser', model);
  }
}
