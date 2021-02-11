import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/_services/project.service';
import { first } from 'rxjs/operators';
import { Building } from 'src/app/_models/building';

@Component({
  selector: 'app-copy-items',
  templateUrl: './copy-items.component.html',
  styleUrls: ['./copy-items.component.css']
})
export class CopyItemsComponent implements OnInit {
  action:string;
  local_data:any;
  projectId = {};
  buildingId = {}
  building: any[] =[];
  lineitems: any[] = [];
  selectedOptions: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<CopyItemsComponent>,
    private formBuilder:FormBuilder,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { }

  doAction(){
    this.dialogRef.close({event:this.action, data:{selectItems:[this.data, this.selectedOptions]}});
  }

  closeDialog(){
    this.dialogRef.close({event:'Cancel'})
  }

  getBuilding(){
    let row_obj = this.data;
    this.projectService.getCopyBulding(row_obj)
    .pipe(first())
    .subscribe(resp =>{
      this.building = resp;
    });
  }

  getLineItems(Id){
    this.projectService.getCopyItems(Id)
    .pipe(first())
    .subscribe(resp =>{
      this.lineitems = resp;
    });
  }

  selectItems(event: Event) {
    const Id = (event.target as HTMLSelectElement).value;
    this.getLineItems(Id);
  }
  
  ngOnInit(): void {
    
    this.getBuilding();

    this.local_data = {...this.data};
    this.action = this.local_data.action;

  }

}
