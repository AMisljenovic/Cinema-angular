import { Component, ViewChild, AfterViewInit, AfterViewChecked } from '@angular/core';
import { jqxFormComponent } from 'jqwidgets-ng/jqxform';
import { jqxValidatorComponent } from 'jqwidgets-ng/jqxvalidator';
import { UserService } from 'src/app/core/services';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignUpComponent implements AfterViewInit, AfterViewChecked {
  @ViewChild('form', {static: false}) jqxForm: jqxFormComponent;
  @ViewChild('validator', { static: false }) jqxValidator: jqxValidatorComponent;
  emailInUse = false;
  usernameInUse = false;
  isServerDown = false;

  columns: Array<jqwidgets.FormTemplateItem> = [
    {
        type: 'button',
        name: 'submit',
        text: 'Submit',
        width: '110px',
        columnWidth: '100%',
        align: 'center',
    }
  ];
  template: Array<jqwidgets.FormTemplateItem> = [
    {
        bind: 'name',
        name: 'firstName',
        type: 'text',
        label: 'First name',
        required: true,
        labelWidth: '85px',
        width: '250px',
        info: 'Enter first name, it cannot contain special characters',
        infoPosition: 'right',
    },
    {
        bind: 'surname',
        name: 'lastName',
        type: 'text',
        label: 'Last name',
        required: true,
        labelWidth: '85px',
        width: '250px',
        info: 'Enter last name, it cannot contain special characters',
        infoPosition: 'right'
    },
    {
      bind: 'username',
      name: 'username',
      type: 'text',
      label: 'Username',
      required: true,
      labelWidth: '85px',
      width: '250px',
      info: 'Your username must be between 4 and 12 characters with no special characters',
      infoPosition: 'right'
    },
    {
      bind: 'password',
      type: 'password',
      name: 'password',
      label: 'Password',
      required: true,
      labelWidth: '85px',
      width: '250px',
      info: 'Must contains between 4 and 12 characters, at least one upper case, one lower case one digit and one special character',
      infoPosition: 'right'
    },
    {
      bind: 'email',
      name: 'email',
      type: 'text',
      label: 'Email',
      required: true,
      labelWidth: '85px',
      width: '250px',
      info: 'Enter your email adress',
      infoPosition: 'right'
    },
    {
        type: 'blank',
        rowHeight: '10px'
    },
    {
        columns: this.columns
    }];


  values = {
    name: '',
    surname: '',
    email: '',
    password: '',
    username: ''
  };

  constructor(private userService: UserService,
              private router: Router) { }

  ngAfterViewInit() {
    this.jqxValidator.onValidationSuccess
    .subscribe(event => {
      this.register();
    });

    this.jqxForm.onFormDataChange
    .subscribe(change => {
      this.values = change.args.value;
    });

    const submitButton = this.jqxForm.getComponentByName('submit');
    submitButton.on('click', () => {
      this.submit();
    });

    const firstName = this.jqxForm.getComponentByName('firstName');
    const lastName = this.jqxForm.getComponentByName('lastName');
    const email = this.jqxForm.getComponentByName('email');
    const password = this.jqxForm.getComponentByName('password');
    const username = this.jqxForm.getComponentByName('username');

    this.jqxValidator.rules([
      {
        input: firstName,
        message: 'Your first name must be between 2 and 40 characters!',
        action: 'keyup, blur',
        rule: 'length=2,40',
      },
      {
        input: firstName,
        message: 'Your first name cannot contain special characters!',
        action: 'keyup, blur, valueChanged',
        rule: this.containsSpecialCharacters
      },
      {
        input: lastName,
        message: 'Your last name must be between 2 and 40 characters!',
        action: 'keyup, blur',
        rule: 'length=2,40',
      },
      {
        input: lastName,
        message: 'Your first name cannot contain special characters!',
        action: 'keyup, blur, valueChanged',
        rule: this.containsSpecialCharacters
      },
      {
        input: username,
        message: 'Your username must be between 4 and 12 characters!',
        action: 'keyup, blur',
        rule: 'length=4,12',
      },
      {
        input: password,
        message: 'Must be between 4 and 12 characters, one lowercase, one upper case, one digit and one special character',
        action: 'keyup, blur, valueChanged',
        rule: (input: any, commit: any) => {
          const inputValue = document.querySelector(input.selector).value as string;

          return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}$/g.test(inputValue);
        },
        position: 'bottom'
      },
      {
        input: email,
        message: 'Email address is required!',
        action: 'keyup, blur',
        rule: 'required',
      },
      {
        input: email,
        message: 'Please enter valild email address!',
        action: 'keyup, blur',
        rule: 'email',
      }
    ]);
  }

  ngAfterViewChecked() {
    const password = document.querySelector('#el_3') as HTMLInputElement;
    password.placeholder = '';
  }

  containsSpecialCharacters(input: any, commit: any): any {
    const inputValue = document.querySelector(input.selector).value as string;

    return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(inputValue);
  }

  submit() {
    this.jqxValidator.validate(document.getElementById('form'));
  }

  register() {
    this.userService.register(this.values)
      .pipe(
        catchError(err => {
          if (err && err.error && err.status === 409) {
            this.usernameInUse = err.error.includes('username');
            this.emailInUse = err.error.includes('email');
          } else if (err && (err.status === 0 || err.status === 500)) {
            this.isServerDown = true;
          }

          return of(err);
        })
      )
      .subscribe(res => {
        if (res.length === 0) {
          this.usernameInUse = false;
          this.emailInUse = false;
          alert('Successfully registered! You will be redirected to the login page');
          this.router.navigateByUrl('login');
        }
      });
  }
}
