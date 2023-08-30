import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './frame.component.html',
  styleUrls: ['./frame.component.css']
})
export class FrameComponent {
  constructor(private router: Router) {
  }

  menuOpen = true;
  menuOptions = [
    {name: 'Home', route: '/app', icon: 'home', active: true},
    {name: 'Users', route: '/app/users', icon: 'person', active: false},
    {name: 'Activities', route: '/app/activities', icon: 'login', active: false},
    {name: 'Logout', route: '/login', icon: 'logout', active: false},
  ];

  onMenuItemClicked(menuItem: any) {
    if (menuItem.name === 'Logout') {
      localStorage.removeItem('token');
    }
    this.menuOptions.forEach((item: any) => {
      item.active = false;
    });
    this.menuOpen = false;
    this.router.navigate([menuItem.route]);
  }
}
