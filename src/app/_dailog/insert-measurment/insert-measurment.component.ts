import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  selector: 'app-insert-measurment',
  templateUrl: './insert-measurment.component.html',
  styleUrls: ['./insert-measurment.component.css']
})
export class InsertMeasurmentComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  selection = new SelectionModel<lineItem>(true, []);
  displayedColumns: string[] = ['select','ShortDescription', 'Qty', 'Unit', 'Rate', 'Amount'];
  action:string;
  local_data:any;
  projectId = [];
  buildingName = {};
  itemID = {};
  items: any[] = [];
  buildingDetails: any[] = [];
  selectedOptions: any[] = [];
  lineItems: lineItem[] = [];
  dataSource;

  constructor(
    public dialogRef: MatDialogRef<InsertMeasurmentComponent>,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { }

  doAction(){
    this.data.buildingName = this.buildingName;
    this.data.item_id = this.itemID;
    this.selection.selected.forEach(s => {
    this.dialogRef.close({event:this.action, data:{selectItems:[this.data, this.selectedOptions]}});
    });
  }

  closeDialog(){
    this.dialogRef.close({event:'Cancel'})
  }

  selectBuilding(event: Event){
    const id = (event.target as HTMLSelectElement).value;
    const name = event.target['options']
    [event.target['options'].selectedIndex].text;
    let row_obj = {building_id: id};
    this.buildingName = name;
    this.projectService.onFilterLineItems(row_obj)
    .pipe(first())
    .subscribe(resp =>{
      this.items = resp;
    });

  }

  selectItem(event: Event){ 
    const id = (event.target as HTMLSelectElement).value;
    let params = {item_id: id};
    this.itemID = params['item_id'];
    this.projectService.getLineItems(params)
    .pipe(first())
    .subscribe(resp =>{
      this.lineItems = resp;
      this.dataSource = new MatTableDataSource<lineItem>(this.lineItems);
      this.dataSource.paginator = this.paginator
    });
   }

  getBuilding(){
    let params = {project_id:this.data['project_id']};
    this.projectService.getBuildingList(params)
    .pipe(first())
    .subscribe(resp =>{
      this.buildingDetails = resp;
    });
  }

  isAllSelected() {
    // const numSelected = this.selection.selected.length;
    const numSelected = this.selection.selected;
    this.selectedOptions = numSelected
    const numRows = this.dataSource.data.length;
    return numSelected;
    
  }


  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  ngOnInit(): void {
    this.getBuilding();

    this.local_data = {...this.data};
    this.action = this.local_data.action;
  }

}
