import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-breadth-count',
  templateUrl: './breadth-count.component.html',
  styleUrls: ['./breadth-count.component.css']
})
export class BreadthCountComponent implements OnInit {
  action: string;
  local_data: any;
  insertBreadth: FormGroup;

  constructor(public dialogRef: MatDialogRef<BreadthCountComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any) { }

    doAction() {
      this.dialogRef.close({ event: this.action, data: [this.insertBreadth.value, this.data] });
    }
  
    closeDialog() {
      this.dialogRef.close({ event: 'Cancel' })
    }

  ngOnInit(): void {
    this.local_data = { ...this.data };
    this.action = this.local_data.action;
    if (this.data['action'] == 'Breadths') {
      if (this.data['value'] == '[object Object]') {
        this.insertBreadth = this.fb.group({
          Breadth: ['', [Validators.required]]
        });
      } else {
        this.insertBreadth = this.fb.group({
          Breadth: [this.data['value'], [Validators.required]]
        });
      }
    } else {
      this.insertBreadth = this.fb.group({
        Breadth: [this.data['row']['Breadth'], [Validators.required]]
      });
    }
  }

}
