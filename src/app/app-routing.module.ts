import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MovieDetailsComponent } from './modules/components';
import { HomeComponent } from './modules/components/home/home.component';
import { HallComponent } from './modules/components/hall/hall.component';
import { LoginComponent } from './modules/components/login/login.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'movie-details/:id',
    component: MovieDetailsComponent
  },
  {
    path: 'hall/:hallId/:repertoryId',
    component: HallComponent
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
