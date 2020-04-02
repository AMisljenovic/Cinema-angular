import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { jqxScrollViewComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxscrollview';
import { jqxLoaderComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxloader';
import { MovieDetailsComponent } from './modules/components/movie-details/movie-details.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './modules/components/header/header.component';
import { FooterComponent } from './modules/components/footer/footer.component';
import { HomeComponent } from './modules/components/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    jqxScrollViewComponent,
    jqxLoaderComponent,
    MovieDetailsComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
   ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
   ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
