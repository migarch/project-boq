import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-length-count',
  templateUrl: './length-count.component.html',
  styleUrls: ['./length-count.component.css']
})
export class LengthCountComponent implements OnInit {

  action: string;
  local_data: any;
  insertLength: FormGroup;

  constructor(public dialogRef: MatDialogRef<LengthCountComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any) { }

  doAction() {
    this.dialogRef.close({ event: this.action, data: [this.insertLength.value, this.data] });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' })
  }

  ngOnInit(): void {
    this.local_data = { ...this.data };
    this.action = this.local_data.action;
    if (this.data['action'] == 'Lengths') {
      if (this.data['value'] == '[object Object]') {
        this.insertLength = this.fb.group({
          Length: ['', [Validators.required]]
        });
      } else {
        this.insertLength = this.fb.group({
          Length: [this.data['value'], [Validators.required]]
        });
      }
    } else {
      this.insertLength = this.fb.group({
        Length: [this.data['row']['Length'], [Validators.required]]
      });
    }

  }

}
