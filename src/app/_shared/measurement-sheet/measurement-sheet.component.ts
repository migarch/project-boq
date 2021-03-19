import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { filter, first, map } from 'rxjs/operators';
import { InsertMeasurmentComponent } from 'src/app/_dailog/insert-measurment/insert-measurment.component';
import { ProjectService } from 'src/app/_services/project.service';
import { MeasurmentService } from 'src/app/_services/measurement-sheet.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, concat } from 'rxjs';
import { MatSelectChange } from '@angular/material/select';
import Swal from 'sweetalert2';
import { LengthCountComponent } from 'src/app/_dailog/length-count/length-count.component';
import { SlideInOutAnimation } from '../_material/animations';
import { animate, group, state, style, transition, trigger } from '@angular/animations';
import { BreadthCountComponent } from 'src/app/_dailog/breadth-count/breadth-count.component';
import { DepthCountComponent } from 'src/app/_dailog/depth-count/depth-count.component';

export interface MeasurementList {
  BuildingId: number;
  BuildingName: string;
  MsData: Measurement[];
}

export interface Measurement {
  id: number;
  CostCode: string;
  BuildingId: number;
  Building: string;
  ShortDescription: string;
  LineItemDetailsId: string;
  Component: string;
  Tag: string;
  XGrid: string;
  YGrid: string;
  Notes: string;
  Level: string;
  No: string;
  Length: string;
  Breadth: string;
  Depth: string;
  Quantity: number;
  Unit: string;
  Bill: string
}

@Component({
  selector: 'app-measurement-sheet',
  templateUrl: './measurement-sheet.component.html',
  styleUrls: ['./measurement-sheet.component.css'],
  animations: [SlideInOutAnimation,
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MeasurementSheetComponent implements OnInit {

  loading = false;
  projectId = {}
  measurement: MeasurementList[] = [];
  dataSource: MatTableDataSource<MeasurementList>;

  columnsToDisplay = ['BuildingName', 'Action'];
  innerDisplayedColumns = ['id', 'Building', 'ShortDescription', 'CostCode', 'Component', 'Tag', 'XGrid', 'YGrid', 'Notes', 'Level', 'No', 'Length', 'Breadth', 'Depth', 'Unit', 'Quantity', 'Bill', 'Action'];
  expandedElement: MeasurementList | null;

  animationState = 'out';
  canEditCode = false;
  insertMeasurement: FormGroup;
  buildingAndLineItems: FormGroup;
  buildingName = {};
  buildingId = {};
  building: any[] = [];
  buildingItems: any[] = [];
  sortname = {};
  shortItemId = {};
  sumOfLength:any = eval;
  insertLengthFormula = {};
  insertBreadthFormula = {};
  insertDepthFormula = {};

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private projectService: ProjectService,
    private measurmentService: MeasurmentService,
    private fb: FormBuilder
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('outerSort', { static: true }) sort: MatSort;
  @ViewChildren('innerSort') innerSort: QueryList<MatSort>;
  @ViewChildren('innerTables') innerTables: QueryList<MatTable<Measurement>>;

  getMeasurement(params) {
    this.loading = true;
    this.measurmentService.onGetAllMeasurement(params)
      .pipe(first())
      .subscribe(res => {
        this.loading = false;
        this.measurement = res;
        this.dataSource = new MatTableDataSource(this.measurement);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.autoCountQuantity();
      });
  }

  autoCountQuantity(){
    let tableData = this.dataSource.data;
    for(let i = 0; i < tableData.length; i++){
      let row = tableData[i]['MsData'];
      for(let j = 0; j < row.length; j++){
          let n = eval(row[j]['No']); 
          let l = eval(row[j]['Length']);
          let b = eval(row[j]['Breadth']);
          let d = eval(row[j]['Depth']);
          row[j]['Quantity'] = n * l * b * d;
      }
    }
  }

  addMeasurement() {
    if (this.insertMeasurement.invalid) {
      return;
    }
    if (this.buildingAndLineItems.invalid) {
      return;
    }
    let row_obj = this.insertMeasurement.value;
    row_obj.buildingName = this.buildingName;
    row_obj.ShortDescription = this.sortname;
    row_obj.project_id = this.projectId;
    row_obj.BuildingId = this.buildingId;
    row_obj.LineItemDetailsId = this.shortItemId;
    this.measurmentService.onInsertMeasurment(row_obj)
      .pipe(first())
      .subscribe(resp => {
        let params = { project_id: this.projectId };
        this.getMeasurement(params);
        this.loading = false;
        this.animationState = this.animationState === 'out' ? 'in' : 'out';
        Swal.fire({
          title: 'add successfully',
          icon: 'success'
        });
        this.insertMeasurement.reset();
        this.buildingAndLineItems.reset();

      });
  }

  reset() {
    this.insertMeasurement.reset();
    this.buildingAndLineItems.reset();
    this.animationState = this.animationState === 'out' ? 'in' : 'out';
  }

  ngOnInit(): void {
    
    this.route.params.subscribe(params => {
      this.getMeasurement(params);
      this.getBuilding(params);
      this.projectId = params.project_id;
    });

    this.buildingAndLineItems = this.fb.group({
      BuildingName: ['', Validators.required],
      ShortDescription: ['', Validators.required],
    });


    this.insertMeasurement = this.fb.group({
      ProjectId: [this.projectId, Validators.required],
      CostCode: ['', Validators.required],
      Component: [''],
      Tag: [''],
      XGrid: [''],
      YGrid: [''],
      Notes: [''],
      Level: [''],
      No: [''],
      Length: [''],
      Breadth: [''],
      Depth: [''],
      Unit: ['', Validators.required],
      Quantity: [''],
      Bill: ['']

    });

  }


  getBuilding(params) {
    this.projectService.getBuildingList(params)
      .pipe(first())
      .subscribe(resp => {
        this.building = resp;
      });
  }

  selectBuilding(event: MatSelectChange) {
    const id = event.value;
    const bname = { buildingName: event.source.triggerValue };
    this.buildingName = event.source.triggerValue;
    this.buildingId = id;
    let params = { BuildingId: id };
    this.projectService.onGetAllLines(params)
      .pipe(first())
      .subscribe(resp => {
        this.buildingItems = resp;
      });
  }

  selectSortDes(event: MatSelectChange) {
    const id = event.value;
    this.sortname = event.source.triggerValue;
    this.shortItemId = id;
    this.getdata(id);
  }

  getdata(id) {
    const data = this.buildingItems.filter(x => {
      let list = x.Description;
      for (let j = 0; j < list.length; j++) {
        if (id === list[j]['id']) {
          this.insertMeasurement = this.fb.group({
            Unit: [list[j]['Unit']],
            CostCode: [list[j]['Costcode']],
            Component: [''],
            Tag: [''],
            XGrid: [''],
            YGrid: [''],
            Notes: [''],
            Level: [''],
            No: [''],
            Length: [''],
            Breadth: [''],
            Depth: [''],
            Quantity: [''],
            Bill: ['']
          });
        }
      }
    });

  }

  copyMeasurementLine(id){
    this.loading = true;
    let rowId = {rowId:id};
    let params = {project_id:this.projectId};
    Swal.fire({
      title: 'Are you sure copy?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confrim',
      cancelButtonText: 'Cancel',
      cancelButtonColor: 'red',
      allowOutsideClick: false,
      allowEscapeKey: true,
    }).then((result) => {
      if (result.value) {
        this.measurmentService.oncopyMeasurementLine(rowId)
        .pipe(first())
        .subscribe(resp =>{
            Swal.fire({
              title: 'Copy successfully',
              icon: 'success',
              timer: 2000,
            });
            this.getMeasurement(params);
            this.loading = false;
          });
      }
    });
  }

  deleteRow(row_obj, i) {
    let params = { id: i }
    // let k = row_obj.id;
    // const data = this.dataSource.data;
    // for(let j=0; j<data.length; j++){
    //   let c = data[j]['MsData'];
    //     for(let b=0; b<c.length; b++){
          // let r = c[b]['id'];
          //   console.log(data[r]);
            // data.splice(r, 1);
            // this.dataSource.data = data;
        // }
      // console.log(inerData);
      // data.splice((this.paginator.pageIndex * this.paginator.pageSize) + i, 1);
      // this.dataSource.data = data;
    // }
    Swal.fire({
      title: 'Are you sure delete?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confrim',
      cancelButtonText: 'Cancel',
      cancelButtonColor: 'red',
      allowOutsideClick: false,
      allowEscapeKey: true,
    }).then((result) => {
      if (result.value) {
        this.measurmentService.onDeleteRow(params)
          .pipe(first())
          .subscribe(resp => {
            let params = {project_id:this.projectId};
            this.getMeasurement(params);
            Swal.fire({
              title: 'Delete successfully',
              icon: 'success',
              timer: 2000,
            });
          });
      }
    });
  }

  cancelItem(row) {
    row.canEditCode = false;
  }

  updateRow(row_obj){
    row_obj.canEditCode = false;
    this.measurmentService.onUpdateMeasurment(row_obj)
    .pipe(first())
    .subscribe(resp =>{
      Swal.fire({
        title: 'Update successfully',
        icon: 'success',
        timer: 2000,
      });
    });
  }

  toggleAdd(divName: string) {
    if (divName === 'addDiv') {
      this.animationState = this.animationState === 'out' ? 'in' : 'out';
    }
  }

  insertlengthModel(event: any, action, obj){
    obj.action = action;
    obj.value = this.insertLengthFormula;
    const dialogRef  = this.dialog.open(LengthCountComponent,{
      disableClose: true,
      data:obj
    });
    dialogRef.afterClosed().subscribe(result =>{
      if(result.event == 'Lengths'){
        this.countLengthInsert(result.data);
      }
    }); 
  }

  countLengthInsert(data){
    const control = this.insertMeasurement.get('Length');
    this.insertLengthFormula = data[0]['Length'];
    control.setValue(eval(data[0]['Length']));
    this.countQuantity();
  }

  insertBreadthModel(event: any, action, obj){
    obj.action = action;
    obj.value = this.insertBreadthFormula;
    const dialogRef  = this.dialog.open(BreadthCountComponent,{
      disableClose: true,
      data:obj
    });
    dialogRef.afterClosed().subscribe(result =>{
      if(result.event == 'Breadths'){
        this.countBreadthInsert(result.data);
      }
    }); 
  }

  countBreadthInsert(data){
    const control = this.insertMeasurement.get('Breadth');
    this.insertBreadthFormula = data[0]['Breadth'];
    control.setValue(eval(data[0]['Breadth']));
    this.countQuantity();
  }

  insertDepthModel(event: any, action, obj){
    obj.action = action;
    obj.value = this.insertDepthFormula;
    const dialogRef  = this.dialog.open(DepthCountComponent,{
      disableClose: true,
      data:obj
    });
    dialogRef.afterClosed().subscribe(result =>{
      if(result.event == 'Depths'){
        this.countDepthInsert(result.data);
      }
    }); 
  }

  countDepthInsert(data){
    const control = this.insertMeasurement.get('Depth');
    this.insertDepthFormula = data[0]['Depth'];
    control.setValue(eval(data[0]['Depth']));
    this.countQuantity();
  }

  countQuantity(){
    const control1 = this.insertMeasurement.get('Length').value;
    const control2 = this.insertMeasurement.get('Breadth').value;
    const control3 = this.insertMeasurement.get('Depth').value;
    const control = this.insertMeasurement.get('Quantity');
    control.setValue(eval(control1+control2+control3));
  }

  rowlengthModel(event: any, action, obj, element){
    obj.action = action;
    obj.row = element;
    const dialogRef  = this.dialog.open(LengthCountComponent,{
      disableClose: true,
      data:obj
    });

    dialogRef.afterClosed().subscribe(result =>{
      if(result.event == 'Length'){
        this.countLengthRow(result.data);
      }
    }); 
  }

  countLengthRow(data){
    let gID = data[1]['row']['id'];
    let gLength = data[0]['Length'];
    let tableData = this.dataSource.data;
    for (let i = 0; i<tableData.length; i++){
        let rowData = tableData[i]['MsData'];
          for(let j = 0; j < rowData.length; j++){
              if(rowData[j]['id'] == gID){
                rowData[j].Length = gLength;
              }
          }
    }
    this.dataSource = new MatTableDataSource(this.measurement);
    this.autoCountQuantity();
  }

  rowBreadthModel(event: any, action, obj, element){
    obj.action = action;
    obj.row = element;
    const dialogRef  = this.dialog.open(BreadthCountComponent,{
      disableClose: true,
      data:obj
    });

    dialogRef.afterClosed().subscribe(result =>{
      if(result.event == 'Breadth'){
        this.countBreadthRow(result.data);
      }
    }); 
  }

  countBreadthRow(data){
    let gID = data[1]['row']['id'];
    let gLength = data[0]['Breadth'];
    let tableData = this.dataSource.data;
    for (let i = 0; i<tableData.length; i++){
        let rowData = tableData[i]['MsData'];
          for(let j = 0; j < rowData.length; j++){
              if(rowData[j]['id'] == gID){
                rowData[j].Breadth = gLength;
              }
          }
    }
    this.dataSource = new MatTableDataSource(this.measurement);
    this.autoCountQuantity();
  }

  rowDepthModel(event: any, action, obj, element){
    obj.action = action;
    obj.row = element;
    const dialogRef  = this.dialog.open(DepthCountComponent,{
      disableClose: true,
      data:obj
    });

    dialogRef.afterClosed().subscribe(result =>{
      if(result.event == 'Depth'){
        this.countDepthRow(result.data);
      }
    }); 
  }

  countDepthRow(data){
    let gID = data[1]['row']['id'];
    let gLength = data[0]['Depth'];
    let tableData = this.dataSource.data;
    for (let i = 0; i<tableData.length; i++){
        let rowData = tableData[i]['MsData'];
          for(let j = 0; j < rowData.length; j++){
              if(rowData[j]['id'] == gID){
                rowData[j].Depth = gLength;
              }
          }
    }
    this.dataSource = new MatTableDataSource(this.measurement);
    this.autoCountQuantity();
  }

}

