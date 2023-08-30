import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiResponse } from 'src/app/interfaces/api-response';
import { FilterActivitiesDto } from 'src/app/interfaces/filter-activities-dto';
import { ActivityService } from 'src/app/services/activity.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css'],
})
export class ActivitiesComponent {
  constructor(
    private activityService: ActivityService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  isLoading = false;
  totalRows = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10];
  dataSource = new MatTableDataSource([]);

  searchKey = '';
  sortBy = 'Timestamp';
  sortDirection = 'desc';

  displayedColumns: string[] = ['Email', 'Success', 'Timestamp'];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngOnInit(): void {
    // Set up paginator
    this.dataSource.paginator = this.paginator;
    // Load initial data
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.activityService
      .filterActivities({
        Email: this.searchKey,
        SortBy: this.sortBy,
        SortDescending: this.sortDirection === 'desc' ? true : false,
        PageNumber: this.currentPage,
        PageSize: this.pageSize,
      } as FilterActivitiesDto)
      .subscribe(
        (response: ApiResponse) => {
          this.dataSource.data = response.data.rows;
          this.paginator.length = response.data.totalCount;
          this.totalRows = response.data.totalCount;
          this.isLoading = false;
        },
        (error: any) => {
          console.log(error);
          this.isLoading = false;
        }
      );
  }

  pageChanged(event: PageEvent) {
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.paginator.pageIndex = event.pageIndex;
    this.paginator.pageSize = event.pageSize;
    this.loadData();
    this.changeDetectorRef.detectChanges();
  }

  sortData(event: any) {
    console.log({ event });
    if (event.direction === '') {
      return;
    }
    this.sortBy = event.active;
    this.sortDirection = event.direction;
    this.loadData();
  }

  clearSearchKey() {
    this.searchKey = '';
    this.loadData();
  }

  searchBarKeyPressed(event: any) {
    if (event.keyCode === 13) {
      this.loadData();
    }
  }
}
