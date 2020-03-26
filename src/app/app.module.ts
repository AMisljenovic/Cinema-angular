import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { jqxScrollViewComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxscrollview';
import { MovieDetailsComponent } from './modules/components/movie-details/movie-details.component';

@NgModule({
  declarations: [
    AppComponent,
    jqxScrollViewComponent,
    MovieDetailsComponent,
   ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
   ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
