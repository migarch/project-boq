import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { ProjectService } from 'src/app/_services/project.service';



@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ViewProjectComponent implements OnInit {

  viewproject: any[] = [];
  dataSource;
  displayedColumns = ['Buliding'];
  expandedElement: any | null;

  constructor(private projectService: ProjectService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.getBoqsceen(params);
    });
  }

  getBoqsceen(params){
    this.projectService.onviewBoq(params)
      .pipe(first())
      .subscribe(resp => {
        this.viewproject = resp;
        this.dataSource = new MatTableDataSource(this.viewproject);
        console.log(this.viewproject);
        let data = this.viewproject;
      });
  }

}
