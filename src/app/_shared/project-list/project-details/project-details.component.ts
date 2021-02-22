import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, OnChanges, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectionListChange } from '@angular/material/list';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';
import { CopyItemsComponent } from 'src/app/_dailog/copy-items/copy-items.component';
import { CopyLineitemsComponent } from 'src/app/_dailog/copy-lineitems/copy-lineitems.component';
import { Building } from 'src/app/_models/building';
import { Items } from 'src/app/_models/items';
import { LineItems } from 'src/app/_models/line-item';
import { ProjectService } from 'src/app/_services/project.service';
import Swal from 'sweetalert2';
import { SlideInOutAnimation } from '../../_material/animations';

export interface lineItem{
  id:string;
  ShortCode:string;
  ShortDescription:string
  LineItemDescription:string;
  Qty:string;
  Unit:string;
  Rate:string;
  Amount:string;
  Remarks:string;
  IsSubLineItem?:boolean;
  lineItem?: lineItem[];
  sublineitems?:subLineItemss[] | MatTableDataSource<subLineItemss>;
}

export interface subLineItemss{
  id:string;
  ShortCode:string;
  ShortDescription:string
  LineItemDescription:string;
  Qty:string;
  Unit:string;
  Rate:string;
  Amount:string;
  Remarks:string;
  IsSubLineItem?:boolean;
}

export interface seqStatus{
  Items:boolean;
  LineItems:boolean;
  SubLineItem:boolean;
}

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css'],
  animations:[SlideInOutAnimation,
      trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.1, 1)')),
    ]),]
})


export class ProjectDetailsComponent implements OnInit {
  @ViewChild('outerSort', { static: true }) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChildren('innerSort') innerSort: QueryList<MatSort>;
  @ViewChildren('innerTables') innerTables: QueryList<MatTable<subLineItemss>>;
  animationState = 'out';
  animationState2 = 'out';
  buildingDetails: Building[] = [];
  buildingItem: Items[] = [];
  sequenceStatus: seqStatus[] = []
  Line: lineItem[] = [];
  dataSource:MatTableDataSource<lineItem>;
  usersData: lineItem[] = [];
  columnsToDisplay = ['ShortCode','LineItemDescription','IsSubLineItem','Qty','Unit','Rate','Amount','Remarks','Action'];
  innerDisplayedColumns = ['ShortCode','LineItemDescription','Qty','Unit','Rate','Amount','Remarks', 'Action'];
  expandedElement: lineItem | null;
  isTableExpanded = false;
  
  projectDetails:any[] = [];
  ProjectName:string;
  projectId = {};
  getBuildingId = {};
  getBItemId = {}
  addBulding: FormGroup;
  addItems: FormGroup;
  addLineItems: FormGroup;

  disabledAddItem = false;
  disabledCopyItem = false;
  disabledAddLineItems = false;
  disabledCopyLineItem = false;
  disabledSequence = true;

  sequenceItem: any[] = [
    {value: 'A-Z', viewValue: 'A,B,C'},
    {value: 'a-z', viewValue: 'a,b,c'},
    {value: '1-N', viewValue: '1,2,3'}
  ];

  sequenceLineItem: any[] = [
    {value: 'A-Z', viewValue: 'A,B,C'},
    {value: 'a-z', viewValue: 'a,b,c'},
    {value: '1-N', viewValue: '1,2,3'}
  ];

  ItemShortCodeType:string;
  LineItemShortCodeType:string;
  selectedItem;
  selectedLineItem;

  canEditCode = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private projectService: ProjectService,
    public dialog: MatDialog,
    private cd: ChangeDetectorRef
    ) { }

  getBuilding(params){
    this.projectService.getBuildingList(params)
    .pipe(first())
    .subscribe(resp =>{
      this.buildingDetails = resp;
        this.projectService.getProjectDetails(params)
        .pipe(first())
        .subscribe(resp =>{
          this.projectDetails = resp;
          this.ProjectName = this.projectDetails[0]['ProjectName'];
          this.ItemShortCodeType = this.projectDetails[0]['ItemShortCodeType'];
          this.LineItemShortCodeType = this.projectDetails[0]['LineItemShortCodeType'];
          if(this.ItemShortCodeType == 'A-Z'){
            this.selectedItem = this.sequenceItem[0].value;
          }else if(this.ItemShortCodeType == 'a-z'){
            this.selectedItem = this.sequenceItem[1].value;
          }else if(this.ItemShortCodeType == '1-N'){
            this.selectedItem = this.sequenceItem[2].value;
          }
          if(this.LineItemShortCodeType == 'A-Z'){
            this.selectedLineItem = this.sequenceLineItem[0].value;
          }else if(this.LineItemShortCodeType == 'a-z'){
            this.selectedLineItem = this.sequenceLineItem[1].value;
          }else if(this.LineItemShortCodeType == '1-N'){
            this.selectedLineItem = this.sequenceLineItem[2].value;
          }
          
        })
    });
  }

  sendBuildingData(){
    if(this.addBulding.invalid){
      return;
    }
    const row_obj = this.addBulding.value;
    let params = {project_id:row_obj.ProjectId}
    this.projectService.addBuilding(row_obj)
    .pipe(first())
    .subscribe({
      next: () =>{
        this.animationState = this.animationState === 'out' ? 'in' : 'out';
        this.addBulding.reset();
        Swal.fire({
          toast:true,
          title: 'add successfully',
          position:'top',
          timer: 1500,
          icon:'success',
          showConfirmButton:false,
        })
        this.getBuilding(params);
      }, error: error =>{
          Swal.fire({
            toast:true,
            title: error,
            position:'top',
            timer: 1500,
            icon:'error',
            showConfirmButton:false,
          })
      }
    })
    
  }

  sendItemsData(){
    if(this.addItems.invalid){
      return;
    }
    let sortcode = {ItemShortCode:null};
    let ItemShortCodeType = {ItemShortCodeType:this.projectDetails[0]['ItemShortCodeType']};
    const row_obj = [this.addItems.value, this.getBuildingId, sortcode, ItemShortCodeType];
    let params = this.getBuildingId;
    this.projectService.addBuildingItems(row_obj)
    .pipe(first())
    .subscribe(resp =>{ 
        this.buildingList(params);
        this.addItems.reset();
        this.animationState2 = this.animationState2 === 'out' ? 'in' : 'out';
        Swal.fire({
          toast:true,
          title: 'add successfully',
          position:'top',
          timer: 1500,
          icon:'success',
          showConfirmButton:false,
        })
    });

  }

  getBuildingList(change: MatSelectionListChange){
    let params = {building_id:change.option.value};
    this.disabledAddItem = true;
    this.buildingList(params);
  }

  buildingList(params){
    this.projectService.getBuildingItems(params)
    .pipe(first())
    .subscribe(resp =>{
      this.buildingItem = resp;
      this.getBuildingId = params;
      if(resp == ''){
        this.disabledSequence = false;
      }else
      {
        this.disabledSequence = true;
      }
    })
  }

  getItemId(change: MatSelectionListChange){
    let params = {item_id:change.option.value};
    this.getLineItems(params);
    this.getBItemId = params;
  }

  getLineItems(params){
    this.projectService.getLineItems(params)
    .pipe(first())
    .subscribe(resp =>{
      
      this.usersData = resp;
      this.Line.forEach(lineItem => {
        if (lineItem.sublineitems && Array.isArray(lineItem.sublineitems)) {
          this.usersData = [...this.usersData, {...lineItem, sublineitems: new MatTableDataSource(lineItem.sublineitems)}];
        } else {
          this.usersData = [...this.usersData, lineItem];
        }
      });
      
      this.dataSource = new MatTableDataSource<lineItem>(this.usersData);
      this.dataSource.paginator = this.paginator;

      this.disabledAddLineItems = true;
      this.disabledCopyLineItem = true;
    });
  }

  toggleRows() {
    this.isTableExpanded = !this.isTableExpanded;
    this.dataSource.data.forEach((row: any) => {
      row.isExpanded = this.isTableExpanded;
    })
  }

  addLineItem(){
    
  }
  

  get f() { return this.addItems.controls; }
  
  reset(){
    this.addBulding.reset();
    this.animationState = this.animationState === 'out' ? 'in' : 'out';
    
  }

  reset2(){
    this.addItems.reset();
    this.animationState2 = this.animationState2 === 'out' ? 'in' : 'out';
  }

  ngOnInit(): void {

    this.route.params.subscribe(params =>{
      this.getBuilding(params);
      this.getStatus(params);
      this.projectId = params.project_id;
    });

    this.addBulding = this.fb.group({
      ProjectId:[this.projectId, Validators.required],
      BuildingShortCode:[''],
      BuildingName:['', Validators.required]
    });

    this.addItems = this.fb.group({
      ItemsName:['', Validators.required]
    });

  }

  getStatus(params){
    this.projectService.onGetStatus(params)
    .pipe(first())
    .subscribe(resp =>{
      this.sequenceStatus = resp.response;
    })
  }

  toggleAdd(divName: string){
    if (divName === 'addDiv') {
      this.animationState = this.animationState === 'out' ? 'in' : 'out';
    }else if(divName === 'addDiv2') {
      this.animationState2 = this.animationState2 === 'out' ? 'in' : 'out';
    }
  }

  slectAndItems(action, obj){
    obj.action = action;
    obj.ItemShortCodeType = this.projectDetails[0]['ItemShortCodeType'];
    obj.projectId = this.projectId;
    obj.BuildingId = this.getBuildingId['building_id'];
    const dialogRef = this.dialog.open(CopyItemsComponent,{
      disableClose: true,
      data:obj
    });
    dialogRef.afterClosed().subscribe(result =>{
      if(result.event == 'Select'){
        this.copySelectItems(result.data);
      }
    });
  }
  
  copySelectItems(row_obj){
    this.projectService.copySelectedItem(row_obj)
    .pipe(first())
    .subscribe(resp =>{
      let parmas = this.getBuildingId;
      this.buildingList(parmas);
    });
  }

  slecetAndLineItems(action, obj){
    obj.action = action;
    obj.BuildingId = this.getBuildingId['building_id'];
    obj.LineItemShortCodeType = this.projectDetails[0]['LineItemShortCodeType'];
    obj.projectId = this.projectId;
    obj.itemId = this.getBItemId['item_id'];
    console.log(obj);
    const dialogRef = this.dialog.open(CopyLineitemsComponent,{
      // disableClose: true,
      data:obj
    });
    dialogRef.afterClosed().subscribe(result =>{
      if(result.event == 'Select'){
        this.copySelectLineItems(result.data);
      }
    });
  }

  copySelectLineItems(row_obj){
    console.log(row_obj);
    this.projectService.onCopyLineItem(row_obj)
    .pipe(first())
    .subscribe(resp => {
      console.log(resp);
    });

  }

  itemSequence($event: Event){
    let type = 'Item';
    let value = ($event.target as HTMLSelectElement).value;
    let data = {project_id: this.projectId, ShortCodeSlug: type, ItemShortCodeType:value};
    this.projectService.onChangeSqStatus(data)
    .pipe(first())
    .subscribe({
      next: () =>{
        Swal.fire({
          toast:true,
          title: 'Update successfully',
          position:'top',
          timer: 1500,
          icon:'success',
          showConfirmButton:false,
        });
      }
    });
  }

  lineitemSequence($event: Event){
    let type = 'LineItem';
    let value = ($event.target as HTMLSelectElement).value;
    let data = {project_id: this.projectId, ShortCodeSlug: type, LineItemShortCodeType:value};
    this.projectService.onChangeSqStatus(data)
    .pipe(first())
    .subscribe({
      next: () =>{
        Swal.fire({
          toast:true,
          title: 'Update successfully',
          position:'top',
          timer: 1500,
          icon:'success',
          showConfirmButton:false,
        });
      }
    });
  }

  toggleRow(element: lineItem) {
    element.sublineitems && (element.sublineitems as MatTableDataSource<lineItem>).data.length ? 
    (this.expandedElement = this.expandedElement === element ? null : element) : null;
    this.cd.detectChanges();
    this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<lineItem>).sort = this.innerSort.toArray()[index]);
  }

  editBuilding(building: Building){
    this.animationState = this.animationState === 'out' ? 'in' : 'in';
    this.addBulding = this.fb.group({
      ProjectId:[this.projectId, Validators.required],
      BuildingShortCode:[building.BuildingShortCode],
      BuildingName:[building.BuildingName, Validators.required]
    }); 
  }


  updateBuilding(building){
    building.canEditCode = false;
    this.projectService.onUpdateBuilding(building)
    .pipe(first())
    .subscribe({
      next: () =>{
        Swal.fire({
          toast:true,
          title: 'Update successfully',
          position:'top',
          timer: 1500,
          icon:'success',
          showConfirmButton:false,
        })
      }
    });
  }

  cancelEdit(building){
    building.canEditCode = false;
  }

  deleteBuilding(i){
    this.buildingDetails.splice(i, 1);
  }

  updateItem(items){
    items.canEditCode = false;
    this.projectService.onUpdateItem(items)
    .pipe(first())
    .subscribe({
      next: () =>{
        Swal.fire({
          toast:true,
          title: 'Update successfully',
          position:'top',
          timer: 1500,
          icon:'success',
          showConfirmButton:false,
        })
      }
    });
  }

  cancelItem(items){
    items.canEditCode = false;
  }

  deleteItem(index){
    let params = {item_id:index}
    this.projectService.onDeleteItem(params)
    .pipe(first())
    .subscribe(resp =>{
      this.buildingItem.splice(index, 1);
    });
  }

  updateLineItem(element){
    element.canEditCode = false;
    let row_obj = {LineItemId:element.id, ShortDescription: element.ShortDescription, LineItemDescription:element.LineItemDescription,
      Qty: element.Qty, Unit:element.Unit, Rate:element.Rate,Amount:element.Amount, Remarks:element.Remarks};
    this.projectService.onUpdateLineItem(row_obj)
    .pipe(first())
    .subscribe({
      next: () =>{
        Swal.fire({
          toast:true,
          title: 'Update successfully',
          position:'top',
          timer: 1500,
          icon:'success',
          showConfirmButton:false,
        })
      }
    });
  }

  deleteLineItem(id){
    let params = {line_item_id:id}
    const data = this.dataSource.data;
    this.projectService.onDeleteLineItem(params)
    .pipe(first())
    .subscribe(resp =>{
      // data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
      data.splice(id, 1);
      this.dataSource.data = data;
    });
  }

  deletesulineItem(index){
    const data = this.dataSource.data;
    let params = {subline_item_id:index}
    this.projectService.onDeleteSubitem(params)
    .pipe(first())
    .subscribe(resp =>{
      console.log(resp);
    });
  }


}
