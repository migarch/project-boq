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
        for(let i=0; i<data.length; i++){
          let itemname = data[i][0];
          console.log(itemname);
          // for(let i=0; i<itemname.length; i++){
            // console.log(itemname[i]['ItemName']);
          // }
          
        }
        
        // console.log(this.viewproject[0]['Items'][0][0]['id']);
      });
  }

}
