import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/models';
import { ReservationService } from 'src/app/core/services';
import { Router } from '@angular/router';
import { ProfileModalComponent } from '../profile-modal/profile-modal.component';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: User;

  constructor(private router: Router,
              private reservationService: ReservationService,
              public matDialog: MatDialog) { }

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    if (this.user === null) {
      alert('You must be signed in to access this page');
      this.router.navigateByUrl('signin');
    }
  }


  edit() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = 'modal-component';
    dialogConfig.height = '500px';
    dialogConfig.width = '480px';
    dialogConfig.data = this.user;
    dialogConfig.data.newPassword = '';

    this.matDialog.open(ProfileModalComponent, dialogConfig);
  }
}
