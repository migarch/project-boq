import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { ProjectService } from 'src/app/_services/project.service';

export interface lineItem{
  id:string;
  ShortCode:string;
  LineItemDescription:string;
  Qty:string;
  Unit:string;
  Rate:string;
  Amount:string;
  Remarks:string;
}

@Component({
  selector: 'app-copy-lineitems',
  templateUrl: './copy-lineitems.component.html',
  styleUrls: ['./copy-lineitems.component.css']
})
export class CopyLineitemsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['select','LineItemDescription', 'Qty', 'Unit', 'Rate', 'Amount'];
  selection = new SelectionModel<lineItem>(true, []);
  dataSource;

  action:string;
  local_data:any;
  projectId = [];
  buildingDetails: any[] = [];
  items: any[] = [];
  lineItems: lineItem[] = [];

  selectedOptions: any[] = []

  constructor(
    public dialogRef: MatDialogRef<CopyLineitemsComponent>,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { }

  doAction(){
    this.selection.selected.forEach(s => {
    this.dialogRef.close({event:this.action, data:{selectItems:[this.data, s]}});
    });
  }

  closeDialog(){
    this.dialogRef.close({event:'Cancel'})
  }

  selectBuilding(event: Event){
    const id = (event.target as HTMLSelectElement).value;
    let row_obj = {building_id: id};
    this.projectService.onFilterLineItems(row_obj)
    .pipe(first())
    .subscribe(resp =>{
      this.items = resp;
    });

  }

  selectItem(event: Event){ 
    const id = (event.target as HTMLSelectElement).value;
    let params = {item_id: id};
    this.projectService.getLineItems(params)
    .pipe(first())
    .subscribe(resp =>{
      this.lineItems = resp;
      this.dataSource = new MatTableDataSource<lineItem>(this.lineItems);
      this.dataSource.paginator = this.paginator
    });
   }

   isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }


  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }


  getBuilding(){
    let bid = this.data.BuildingId
    let row_obj = {projectId:this.data['projectId'], BuildingId:bid};
    this.projectService.getCopyBulding(row_obj)
    .pipe(first())
    .subscribe(resp =>{
      this.buildingDetails = resp;
    });
  }

  ngOnInit(): void {
    // this.dataSource.paginator = this.paginator;
    

    this.getBuilding();

    this.local_data = {...this.data};
    this.action = this.local_data.action;
    

  }

}

