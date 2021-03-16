import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-length-count',
  templateUrl: './length-count.component.html',
  styleUrls: ['./length-count.component.css']
})
export class LengthCountComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<LengthCountComponent>,
    @Inject(MAT_DIALOG_DATA) private data:any) { }

  ngOnInit(): void {
  }

}
