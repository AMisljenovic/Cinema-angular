import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
// import { jqxScrollViewComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxscrollview';
// import { jqxLoaderComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxloader';
import { MovieDetailsComponent } from './modules/components/movie-details/movie-details.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './modules/components/header/header.component';
import { FooterComponent } from './modules/components/footer/footer.component';
import { HomeComponent } from './modules/components/home/home.component';
// import { jqxGridComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';
// import { jqxButtonComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxbuttons';
// import { jqxPanelComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxpanel';
// import { jqxInputComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxinput';
// import { jqxPasswordInputComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxpasswordinput';
// import { jqxScrollViewComponent } from 'jqwidgets-ng/jqxscrollview/angular_jqxscrollview';
import { HallComponent } from './modules/components/hall/hall.component';
import { ModalComponent } from './modules/components';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './modules/components/login/login.component';
import { jqxGridModule } from 'jqwidgets-ng/jqxgrid';
import { jqxScrollViewModule } from 'jqwidgets-ng/jqxscrollview';
import { jqxLoaderModule } from 'jqwidgets-ng/jqxloader';
import { jqxButtonModule } from 'jqwidgets-ng/jqxbuttons';
import { jqxPanelModule } from 'jqwidgets-ng/jqxpanel';
import { jqxInputModule } from 'jqwidgets-ng/jqxinput';
import { jqxPasswordInputModule } from 'jqwidgets-ng/jqxpasswordinput';

@NgModule({
  declarations: [
    AppComponent,
    MovieDetailsComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    HallComponent,
    ModalComponent,
    LoginComponent,
   ],
  imports: [
    jqxGridModule,
    jqxButtonModule,
    jqxInputModule,
    jqxPanelModule,
    jqxPasswordInputModule,
    jqxLoaderModule,
    jqxScrollViewModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatDialogModule
   ],
   providers: [ ],
  entryComponents: [
    ModalComponent,
   ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
