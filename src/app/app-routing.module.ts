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
    redirectTo: 'hall/ed5e3547-bf44-437c-8f9f-a94036ae860c/661ac04f-8289-4eec-9530-c648264eb9a4',
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
