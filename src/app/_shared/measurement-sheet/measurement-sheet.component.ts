import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { filter, first, map } from 'rxjs/operators';
import { InsertMeasurmentComponent } from 'src/app/_dailog/insert-measurment/insert-measurment.component';
import { ProjectService } from 'src/app/_services/project.service';
import { MeasurmentService } from 'src/app/_services/measurement-sheet.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { MatSelectChange } from '@angular/material/select';
import Swal from 'sweetalert2';

export interface Measurement{
  id: number;
  ShortCode:string;
  Building:string;
  ShortDescription: string;
  LineItemDetailsId: string;
  CostCode:string;
  Component:string;
  Tag:string;
  XGrid:string;
  YGrid:string;
  Notes:string;
  Level:string;
  No:string;
  Length:string;
  Breadth:string;
  Depth:string;
  Quantity:string;
  Unit:string;
  Bill:string
  isEditable: boolean;
  canEditMode: boolean;
  saveButton: boolean;
}

interface Unit{
  Unit: String;
  cat : Value[]
}

interface Value{
  Length:boolean;
  Breadth:boolean;
  Depth:boolean;
}






@Component({
  selector: 'app-measurement-sheet',
  templateUrl: './measurement-sheet.component.html',
  styleUrls: ['./measurement-sheet.component.css']
})
export class MeasurementSheetComponent implements OnInit {
  unt: Unit[] = [
    {Unit: 'Packet',
    cat: [{Length:true, Breadth: false, Depth: true}]
    },
    {Unit: 'new',
    cat: [{Length:true, Breadth: false, Depth: true}]
    }
  ]
  loading= false;
  projectId = {}
  measurementList: FormGroup;
  measurement: Measurement[] = [];
  building: any[] = [];
  buildingItems: any[] = [];
  alllineitem: any[] = [];
  buildingName = {};
  sortname = {};
  displayedColumns = ['ShortCode','Building','ShortDescription','CostCode','Component','Tag','XGrid','YGrid','Notes','Level','No','Length','Breadth','Depth','Quantity','Unit','Bill','Action'];
  dataSource;

  filterUnit = {};
  disabledlength = true;

  canEditCode = true;
  canEditMode = true;
  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private projectService: ProjectService,
    private measurmentService : MeasurmentService,
    private fb: FormBuilder 
  ) { }

  @ViewChild(MatPaginator) paginator:MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  getMeasurement(params){
    this.loading = true;
    this.measurmentService.onGetAllMeasurement(params)
    .pipe(first())
    .subscribe(res =>{
      this.loading = false;
      this.measurement = res;
      this.dataSource = new MatTableDataSource(this.measurement);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.setControl();
    });
  }

  configMeasurment(action, obj){
    obj.action = action;
    obj.project_id = this.projectId;
    const dialogRef = this.dialog.open(InsertMeasurmentComponent,{
      disableClose: true,
      data:obj
    });
    dialogRef.afterClosed().subscribe(result =>{
      if(result.event == 'Insert'){
        this.addMeasurment(result.data);
      }
    });
  }

  inserMeasure(){
    
  }

  addMeasurment(row_obj){
    this.loading = true;
    this.measurmentService.onInsertMeasurment(row_obj)
    .pipe(first())
    .subscribe(resp =>{
      let params = {project_id:this.projectId};
      this.getMeasurement(params);
      this.loading = false;
    });
  }

  copyMeasurementLine(id){
    this.loading = true;
    let rowId = {rowId:id};
    this.measurmentService.oncopyMeasurementLine(rowId)
    .pipe(first())
    .subscribe(resp =>{
      let params = {project_id:this.projectId};
      this.getMeasurement(params);
      this.loading = false;
    });
  }

  getBuilding(params){
    this.projectService.getBuildingList(params)
    .pipe(first())
    .subscribe(resp =>{
      this.building = resp;
    });
  }



  ngOnInit(): void {
    this.route.params.subscribe(params =>{
      this.getMeasurement(params);
      this.getBuilding(params);
      this.projectId = params.project_id;
    });

    this.measurementList = this.fb.group({
      tableRows: this.fb.array([])
    });
    
    
  }

  get tableRows(): FormArray {
    return this.measurementList.get('tableRows') as FormArray;
  }

  setControl(){
        this.measurement.forEach((data)=>{
          this.tableRows.push(this.setUsersFormArray(data));
    });
  }

  setUsersFormArray(data){
    return this.fb.group({
      id: [data.id],
      Building: [data.Building],
      ShortDescription: [data.ShortDescription],
      CostCode:[data.CostCode],
      LineItemDetailsId:[data.LineItemDetailsId],
      Component:[data.Component],
      Tag:[data.Tag],
      XGrid:[data.XGrid],
      YGrid:[data.YGrid],
      Notes:[data.Notes],
      Level:[data.Level],
      No:[data.No],
      Length:[data.Length],
      Breadth:[data.Breadth],
      Depth:[data.Depth],
      Quantity:[data.Quantity],
      Unit:[data.Unit],
      Bill:[data.Bill],
      isEditable: false,
      canEditMode: false,
      saveButton: false,
    })
  }


  addMeasurmentsheet(){
      this.measurement.unshift(
        {
          id:null,
          ShortCode: null,
          Building: null,
          ShortDescription: null,
          CostCode: 'null',
          LineItemDetailsId:null,
          Component:null,
          Tag:null,
          XGrid:null,
          YGrid:null,
          Notes:null,
          Level:null,
          No:null,
          Length:null,
          Breadth:null,
          Depth:null,
          Quantity:null,
          Unit:null,
          Bill:null,
          isEditable: true,
          canEditMode: false,
          saveButton: true
        }
      );
      this.dataSource = new MatTableDataSource(this.measurement);
      // this.dataSource.sort = this.sort;
      // this.dataSource.paginator = this.paginator;
  }

  selectBuilding(event: MatSelectChange){
    const id = event.value;
    const bname = {buildingName:event.source.triggerValue};
    this.buildingName = bname;
    let params = {BuildingId: id};
    this.projectService.onGetAllLines(params)
    .pipe(first())
    .subscribe(resp =>{
      this.buildingItems = resp;
    });
  }

  selectLineItem(event: MatSelectChange){
    const row = event.value;
    let params = {id:row['id'], ItemShortCode:row['ItemShortCode']};
    this.projectService.onGetAllLineitems(params)
    .pipe(first())
    .subscribe(resp =>{
      this.alllineitem = resp;
    });
  }

  selectSortDes(event: MatSelectChange, i){
    const id = event.value;
    const SortName = {sortname:event.source.triggerValue};
    this.sortname = SortName;
    this.getdata(id, i);
  }

  getdata(id, i){
    const data =  this.buildingItems.filter(x =>{
      let list = x.Description;
      for (let j = 0; j < list.length; j++){
          if(id === list[j]['id']){
            let getun = list[j]['Unit'];
            this.untData(getun);
            const controlArray = <FormArray> this.measurementList.get('tableRows');
            controlArray.controls[i].get('CostCode').setValue(list[j]['Costcode']);
            controlArray.controls[i].get('LineItemDetailsId').setValue(list[j]['id']);
            controlArray.controls[i].get('Component').setValue(null);
            controlArray.controls[i].get('Tag').setValue(null);
            controlArray.controls[i].get('XGrid').setValue(null);
            controlArray.controls[i].get('YGrid').setValue(null);
            controlArray.controls[i].get('Notes').setValue(null);
            controlArray.controls[i].get('Level').setValue(null);
            controlArray.controls[i].get('No').setValue(null);
            controlArray.controls[i].get('Length').setValue(null);
            controlArray.controls[i].get('Breadth').setValue(null);
            controlArray.controls[i].get('Depth').setValue(null);
            controlArray.controls[i].get('Quantity').setValue(null);
            controlArray.controls[i].get('Unit').setValue(list[j]['Unit']);
            controlArray.controls[i].get('Bill').setValue(null);
          }
      }
    });
    
  }

  untData(getun: string){
    console.log(getun)
    let l  = this.unt;
    for (let i = 0; i < l.length; i++){
      if(l[i]['Unit'] === getun){
        this.filterUnit = l[i]['cat'];
        console.log(l[i]['cat'][0]['Length']);
        // if(l[i]['cat']['Length'] == true){
        //   console.log(l[i]['cat']['Length']);
        // }
        
      }
    }

  }

  editRow(row_obj, i){
    row_obj.isEditable = true;
    row_obj.canEditMode = true;
    row_obj.saveButton = false;
  }

  editElement(row_obj, i){
    const controlArray = <FormArray> this.measurementList.get('tableRows');
    const data = controlArray.controls[i].value;
    this.measurmentService.onUpdateMeasurment(data)
    .pipe(first())
    .subscribe(resp =>{
      row_obj.isEditable = false;
      row_obj.canEditMode = false;
      row_obj.saveButton = false;
      Swal.fire({
        toast:true,
        title: 'Update successfully',
        position:'top',
        timer: 1500,
        icon:'success',
        showConfirmButton:false,
      })
    });
  }

  insertMeasuremnt(i){
    const controlArray = <FormArray> this.measurementList.get('tableRows');
    const row_obj = controlArray.controls[i].value;
    this.finalfunction(row_obj);
  }

  finalfunction(row_obj){
    row_obj.bName = this.buildingName;
    row_obj.sname = this.sortname;
    row_obj.pId = {project_id:this.projectId};
    console.log(row_obj);
    this.loading = true;
    this.measurmentService.onInsertMeasurment(row_obj)
    .pipe(first())
    .subscribe(resp =>{
      let params = {project_id:this.projectId};
      this.getMeasurement(params);
      this.loading = false;
    });
  }

  deleteRow(row_obj, i){
    let params = {id:row_obj.id}
    Swal.fire({
      title: 'Are you sure delete?',
      icon:'warning',
      showCancelButton: true,
      confirmButtonText: 'Confrim',
      cancelButtonText: 'Cancel',
      cancelButtonColor:'red',
      allowOutsideClick: false,
      allowEscapeKey: true,
    }).then((result) => {
      if(result.value) {
        this.measurmentService.onDeleteRow(params)
        .pipe(first())
        .subscribe(resp =>{
          Swal.fire({
            title: 'Delete successfully',
            icon:'success',
            timer:2000,
          });
          const data = this.dataSource.data;
          data.splice((this.paginator.pageIndex * this.paginator.pageSize) + i, 1);
          this.dataSource.data = data;
        });
      }
    });


    
  }

  editLength(row, i){
    console.log(row);
  }
  

}

