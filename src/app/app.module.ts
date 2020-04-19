import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { ModalComponent, SignUpComponent, MovieDetailsComponent,
  HeaderComponent, FooterComponent, HomeComponent, HallComponent, SignInComponent } from './modules/components';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { jqxGridModule } from 'jqwidgets-ng/jqxgrid';
import { jqxScrollViewModule } from 'jqwidgets-ng/jqxscrollview';
import { jqxLoaderModule } from 'jqwidgets-ng/jqxloader';
import { jqxButtonModule } from 'jqwidgets-ng/jqxbuttons';
import { jqxPanelModule } from 'jqwidgets-ng/jqxpanel';
import { jqxInputModule } from 'jqwidgets-ng/jqxinput';
import { jqxFormModule} from 'jqwidgets-ng/jqxform';
import { jqxPasswordInputModule } from 'jqwidgets-ng/jqxpasswordinput';
import { jqxValidatorModule } from 'jqwidgets-ng/jqxvalidator';
import { ProfileComponent } from './modules/components/profile/profile.component';
import { ProfileModalComponent } from './modules/components/profile-modal/profile-modal.component';
import { PageNotFoundComponent } from './modules/components/page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    MovieDetailsComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    HallComponent,
    ModalComponent,
    SignInComponent,
    SignUpComponent,
    ProfileComponent,
    ProfileModalComponent,
    PageNotFoundComponent,
   ],
  imports: [
    jqxGridModule,
    jqxButtonModule,
    jqxInputModule,
    jqxPanelModule,
    jqxPasswordInputModule,
    jqxLoaderModule,
    jqxScrollViewModule,
    jqxFormModule,
    jqxValidatorModule,
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
    ProfileModalComponent
   ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
