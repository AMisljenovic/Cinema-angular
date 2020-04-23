import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SeatPosition } from 'src/app/shared/models';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  seats: SeatPosition[];
  totalPrice: number;
  seatsReserved = false;
  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) private modalData: any,
  ) { }

  ngOnInit() {
    this.seats = this.modalData.seats;
    this.totalPrice = this.modalData.totalPrice;
  }

  reserve() {
    this.seatsReserved = true;
    this.closeModal();
  }

  closeModal() {
    this.dialogRef.close(this.seatsReserved);
  }
}
