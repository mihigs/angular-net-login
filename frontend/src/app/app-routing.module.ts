import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { canActivate } from './authguard.guard';

import { LoginComponent } from './pages/login/login.component';
import { FrameComponent } from './pages/frame/frame.component';
import { HomepageComponent } from './pages/home/homepage.component';
import { UsersComponent } from './pages/users/users.component';
import { ActivitiesComponent } from './pages/activities/activities.component';
import { NotFoundPageComponent } from './common/not-found-page/not-found-page.component';
import { NewUserComponent } from './pages/new-user/new-user.component';

const routes: Routes = [
  //default route
  { path: '', redirectTo: '/app', pathMatch: 'full' },
  { path: 'app', component: FrameComponent, canActivate: [canActivate], children: [
    { path: '', component: HomepageComponent, canActivate: [canActivate] },
    { path: 'users', component: UsersComponent, canActivate: [canActivate] },
    { path: 'newUser', component: NewUserComponent, canActivate: [canActivate] },
    { path: 'activities', component: ActivitiesComponent, canActivate: [canActivate] },
  ]}, 
  { path: 'login', component: LoginComponent }, //no need to guard login page
  { path: '**/', component: NotFoundPageComponent, canActivate: [canActivate]} //match any other routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
