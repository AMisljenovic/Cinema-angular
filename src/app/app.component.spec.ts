import { TestBed, ComponentFixture } from '@angular/core/testing';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent, jqxGridComponent]
    });
    fixture = TestBed.createComponent(AppComponent);
  });
});
