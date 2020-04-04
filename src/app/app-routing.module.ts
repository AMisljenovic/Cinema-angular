import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MovieDetailsComponent } from './modules/components';
import { HomeComponent } from './modules/components/home/home.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'movie-details/1df1dac8-0b73-486e-b1a0-ded9d9d0849c',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'movie-details/:id',
    component: MovieDetailsComponent
  }
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
