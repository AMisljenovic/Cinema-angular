import { Component, OnInit, Inject, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/core/services';
import { jqxFormComponent } from 'jqwidgets-ng/jqxform/public_api';
import { jqxValidatorComponent } from 'jqwidgets-ng/jqxvalidator/public_api';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.css']
})
export class ProfileModalComponent implements OnInit, AfterViewInit {
  @ViewChild('form', {static: false}) jqxForm: jqxFormComponent;
  @ViewChild('validator', { static: false }) jqxValidator: jqxValidatorComponent;
  emailInUse = false;
  wrongPassword = false;
  profileIsntUpdated = false;

  columns: Array<jqwidgets.FormTemplateItem> = [
    {
        type: 'button',
        name: 'submit',
        text: 'Submit',
        width: '110px',
        columnWidth: '50%',
        align: 'right',
    },
    {
      type: 'button',
      name: 'cancel',
      text: 'Cancel',
      width: '110px',
      columnWidth: '50%',
  }
  ];
  template: Array<jqwidgets.FormTemplateItem> = [
    {
        bind: 'name',
        name: 'firstName',
        type: 'text',
        label: 'First name',
        required: true,
        labelWidth: '115px',
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
        labelWidth: '115px',
        width: '250px',
        info: 'Enter last name, it cannot contain special characters',
        infoPosition: 'right'
    },
    {
      bind: 'newPassword',
      type: 'password',
      name: 'password',
      label: 'New password',
      required: false,
      labelWidth: '115px',
      width: '250px',
      info: 'Must contains between 4 and 12 characters, at least one upper case, one lower case one digit and one special character',
      infoPosition: 'right'
    },
    {
      bind: 'password',
      type: 'password',
      name: 'oldPassword',
      label: 'Old Password',
      required: true,
      labelWidth: '115px',
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
      labelWidth: '115px',
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
    username: '',
    newPassword: ''
  };

  constructor(private userService: UserService,
              private router: Router,
              public dialogRef: MatDialogRef<ProfileModalComponent>,
              @Inject(MAT_DIALOG_DATA) private modalData: any) { }


  ngOnInit() {
    this.values = this.modalData;
  }

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

    const cancelButton = this.jqxForm.getComponentByName('cancel');
    cancelButton.on('click', () => {
      this.closeModal();
    });

    const firstName = this.jqxForm.getComponentByName('firstName');
    const lastName = this.jqxForm.getComponentByName('lastName');
    const email = this.jqxForm.getComponentByName('email');
    const password = this.jqxForm.getComponentByName('password');

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
        input: password,
        message: 'Must be between 4 and 12 characters, one lowercase, one upper case, one digit and one special character',
        action: 'keyup, blur, valueChanged',
        rule: (input: any, commit: any) => {
          const inputValue = document.querySelector(input.selector).value as string;

          return inputValue.length === 0 ? true : /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}$/g.test(inputValue);
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

  containsSpecialCharacters(input: any, commit: any): any {
    const inputValue = document.querySelector(input.selector).value as string;

    return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(inputValue);
  }

  submit() {
    this.jqxValidator.validate(document.getElementById('form'));
  }

  register() {
    if (this.values.email === this.modalData.email && this.values.name === this.modalData.name &&
      this.values.surname === this.modalData.surname && this.values.newPassword === '') {
      this.profileIsntUpdated = true;
      return;
    }
    this.profileIsntUpdated = false;

    this.values.email = this.modalData.email === this.values.email ? '' : this.values.email;

    this.userService.update(this.values)
      .pipe(
        catchError(err => {
          if (err && err.error && err.status === 409) {
            this.emailInUse = true;
          } else if (err && err.error === 'PasswordDoesntMatch' && err.status === 401) {
            this.wrongPassword = true;
          } else if (err && err.status === 401) {
            alert('Your cookie is not valid anymore. Please sign in again');
            this.navigateToSignIn();
          }

          return of(err);
        }))
      .subscribe(res => {
        if (res.status === 200) {
          this.wrongPassword = false;
          this.emailInUse = false;
          this.profileIsntUpdated = false;

          alert('Profile successfully updated! You will be signed out and redirected to sign in page');
          this.navigateToSignIn();
        }});
  }

  closeModal() {
    this.dialogRef.close();
  }

  navigateToSignIn() {
    sessionStorage.removeItem('user');
    this.router.navigateByUrl('signin');
    this.dialogRef.close();
  }

}