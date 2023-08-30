import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { FilterActivitiesDto } from '../interfaces/filter-activities-dto';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  constructor(
    private apiService: ApiService
  ) { }

  filterActivities(filter: FilterActivitiesDto) {
    return this.apiService.post('/Activity/filterActivities', filter);
  }
}
