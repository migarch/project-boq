import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { InsertMeasurmentComponent } from 'src/app/_dailog/insert-measurment/insert-measurment.component';
import { ProjectService } from 'src/app/_services/project.service';
import { MeasurmentService } from 'src/app/_services/measurement-sheet.service';

@Component({
  selector: 'app-measurement-sheet',
  templateUrl: './measurement-sheet.component.html',
  styleUrls: ['./measurement-sheet.component.css']
})
export class MeasurementSheetComponent implements OnInit {
  loading= false;
  projectId = {}
  measurement: any[] = [];
  displayedColumns = ['ShortCode','Building','Component','Tag','XGrid','YGrid','Notes','Unit','add','duplicate'];
  dataSource; 
  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private projectService: ProjectService,
    private measurmentService : MeasurmentService, 
  ) { }

  @ViewChild(MatPaginator, { static:true}) paginator:MatPaginator;
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

  addMeasurment(row_obj){
    this.measurmentService.onInsertMeasurment(row_obj)
    .pipe(first())
    .subscribe(resp =>{
      this.loading = false;
    });
  }

  copyMeasurementLine(id){
    let rowId = {rowId:id};
    this.measurmentService.oncopyMeasurementLine(rowId)
    .pipe(first())
    .subscribe(resp =>{
      let params = {project_id:this.projectId};
      this.getMeasurement(params)
      this.loading = false;
    });
  }


  ngOnInit(): void {
    this.route.params.subscribe(params =>{
      this.getMeasurement(params);
      this.projectId = params.project_id;
    });

  }

}
