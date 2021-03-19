import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-depth-count',
  templateUrl: './depth-count.component.html',
  styleUrls: ['./depth-count.component.css']
})
export class DepthCountComponent implements OnInit {
  action: string;
  local_data: any;
  insertDepth: FormGroup;

  constructor(public dialogRef: MatDialogRef<DepthCountComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any) { }

    doAction() {
      this.dialogRef.close({ event: this.action, data: [this.insertDepth.value, this.data] });
    }
  
    closeDialog() {
      this.dialogRef.close({ event: 'Cancel' })
    }

  ngOnInit(): void {
    
    this.local_data = { ...this.data };
    this.action = this.local_data.action;
    if (this.data['action'] == 'Depths') {
      if (this.data['value'] == '[object Object]') {
        this.insertDepth = this.fb.group({
          Depth: ['', [Validators.required]]
        });
      } else {
        this.insertDepth = this.fb.group({
          Depth: [this.data['value'], [Validators.required]]
        });
      }
    } else {
      this.insertDepth = this.fb.group({
        Depth: [this.data['row']['Depth'], [Validators.required]]
      });
    }
  }

}
