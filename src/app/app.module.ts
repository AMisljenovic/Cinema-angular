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
import { jqxGridComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';
import { jqxButtonComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxbuttons';
import { jqxPanelComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxpanel';
import { HallComponent } from './modules/components/hall/hall.component';
import { ModalComponent } from './modules/components';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,
    jqxScrollViewComponent,
    jqxLoaderComponent,
    jqxGridComponent,
    jqxButtonComponent,
    jqxPanelComponent,
    MovieDetailsComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    HallComponent,
    ModalComponent,
   ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatDialogModule
   ],
  entryComponents: [
    ModalComponent,
   ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
