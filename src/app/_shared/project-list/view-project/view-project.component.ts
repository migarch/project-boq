import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { ProjectService } from 'src/app/_services/project.service';

@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.css']
})
export class ViewProjectComponent implements OnInit {

  viewproject: any[] = [];

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
        console.log(this.viewproject);
        let data = this.viewproject;
      });
  }

}
