import { Component, ViewChild, ChangeDetectorRef  } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiResponse } from 'src/app/interfaces/api-response';
import { FilterUserDto } from 'src/app/interfaces/filter-user-dto';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent {
  constructor(
    private userService: UserService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    ) {
  }

  isLoading = false;
  totalRows = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10];
  dataSource = new MatTableDataSource([]);

  searchKey = '';
  sortBy = 'Email';
  sortDirection = 'asc';

  displayedColumns: string[] = ['Email', 'CreatedOn'];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngOnInit(): void {
    //Set up paginator
    this.dataSource.paginator = this.paginator;
    //Load initial data
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.userService.filterUsers(
      {
        Email: this.searchKey,
        SortBy: this.sortBy,
        SortDescending: this.sortDirection === 'desc' ? true : false,
        PageNumber: this.currentPage,
        PageSize: this.pageSize
      } as FilterUserDto
    ).subscribe((response: ApiResponse) => {
      this.dataSource.data = response.data.rows;
      this.paginator.length = response.data.totalCount;
      this.totalRows = response.data.totalCount;
      this.isLoading = false;
    }, (error: any) => {
      console.log(error);
      this.isLoading = false;
    });
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

  onAddUserClicked() {
    //navigate to add user page
    this.router.navigate(['/app/newUser']);
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
