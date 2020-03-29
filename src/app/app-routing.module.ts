import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { MovieDetailsComponent } from './modules/components';
import { HomeComponent } from './modules/components/home/home.component';

const routes: Routes = [
  // {
  //   path: '',
  //   children: [
  //   ]
  // },
  { path: '',  redirectTo: '/home', pathMatch: 'full' },
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
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
