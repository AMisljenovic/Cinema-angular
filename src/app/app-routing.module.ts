import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MovieDetailsComponent, SignUpComponent,
  HomeComponent, HallComponent, SignInComponent, AdministratorPanelComponent } from './modules/components';
import { ProfileComponent } from './modules/components/profile/profile.component';
import { PageNotFoundComponent } from './modules/components/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'admin-panel',
    component: AdministratorPanelComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'signin',
    component: SignInComponent
  },
  {
    path: 'signup',
    component: SignUpComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'movie-details/:id',
    component: MovieDetailsComponent
  },
  {
    path: 'hall/:hallId/:repertoryId',
    component: HallComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent
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
