import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterContentChecked, ChangeDetectorRef, Component, OnChanges, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectionListChange } from '@angular/material/list';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { CopyItemsComponent } from 'src/app/_dailog/copy-items/copy-items.component';
import { Building } from 'src/app/_models/building';
import { Items } from 'src/app/_models/items';
import { ProjectService } from 'src/app/_services/project.service';
import Swal from 'sweetalert2';
import { SlideInOutAnimation } from '../../_material/animations';

export interface lineItem{
  id:string;
  ShortCode:string;
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
  LineItemDescription:string;
  Qty:string;
  Unit:string;
  Rate:string;
  Amount:string;
  Remarks:string;
  IsSubLineItem?:boolean;
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
  @ViewChildren('innerSort') innerSort: QueryList<MatSort>;
  @ViewChildren('innerTables') innerTables: QueryList<MatTable<subLineItemss>>;
  animationState = 'out';
  animationState2 = 'out';
  buildingDetails: Building[] = [];
  buildingItem: Items[] = [];

  Line: lineItem[] = [];
  dataSource:MatTableDataSource<lineItem>;
  usersData: lineItem[] = [];
  columnsToDisplay = ['ShortCode','LineItemDescription','IsSubLineItem','Qty','Unit','Rate','Amount','Remarks'];
  innerDisplayedColumns = ['ShortCode','LineItemDescription','Qty','Unit','Rate','Amount','Remarks'];
  expandedElement: lineItem | null;
  
  projectDetails:any[] = [];
  ProjectName:string;
  ItemShortCodeType:string;
  projectId = {};
  getBuildingId = {};
  addBulding: FormGroup;
  addItems: FormGroup;
  addLineItems: FormGroup;
  rows: FormArray;
  enabled = true;
  show = false;
  value:string;
  disabledAddItem = false;
  disabledCopyItem = false;
  disabledAddLineItems = false;
  disabledCopyLineItem = false;
  disabledSequence = true;

  
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
  }

  getLineItems(params){
    this.projectService.getLineItems(params)
    .pipe(first())
    .subscribe(resp =>{
      this.Line = resp;
      this.Line.forEach(itemss => {
        if (itemss.sublineitems && Array.isArray(itemss.sublineitems) && itemss.sublineitems.length) {
          this.usersData = [...this.usersData, {...itemss, sublineitems: new MatTableDataSource(itemss.sublineitems)}];
        } else {
          this.usersData = [...this.usersData, itemss];
        }
      });
      this.dataSource = new MatTableDataSource(this.usersData);

      this.disabledAddLineItems = true;
      this.disabledCopyLineItem = true;
    });
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

  selectLineItems(){
    
  }

  itemSequence(value){
    console.log(this.value = value);
  }

  toggleRow(element: lineItem) {
    element.sublineitems && (element.sublineitems as MatTableDataSource<lineItem>).data.length ? 
    (this.expandedElement = this.expandedElement === element ? null : element) : null;
    this.cd.detectChanges();
    this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<lineItem>).sort = this.innerSort.toArray()[index]);
  }

}
