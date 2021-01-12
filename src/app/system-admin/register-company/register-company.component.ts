import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { SystemService } from 'src/app/services/system.service';

@Component({
  selector: 'app-register-company',
  templateUrl: './register-company.component.html',
  styleUrls: ['./register-company.component.css']
})
export class RegisterCompanyComponent implements OnInit {
  RegiCompany: FormGroup;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private systemService: SystemService,
  ) { }
  
  

  ngOnInit(): void {
    this.RegiCompany = this.formBuilder.group({
      email:['', Validators.email],
      company_name:['', Validators.required],
      company_phone:['', Validators.required],
      company_ho_address:['', Validators.required],
      company_proj_address:['', Validators.required],
      company_logo:['', Validators.required],
      company_gst:['', Validators.required],
      company_type:['', Validators.required],
      project_subscription:['', Validators.required]

    });
  }

  get f() { return this.RegiCompany.controls; }

  OnSubmit(){
    this.submitted = true;
    if (this.RegiCompany.invalid) {
      return;
    }
    this.systemService.RegisterCompany(this.RegiCompany.value)
    .pipe(first())
    .subscribe({
      next:() =>{
          this.router.navigate(['/'], { relativeTo: this.route});
      },
      error: error =>{
        this.error = error;
      }
    })
  }

}
