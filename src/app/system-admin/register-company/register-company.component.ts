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
      ContactEmail:['', Validators.email],
      CompanyName:['', Validators.required],
      ContactPhone:['', Validators.required],
      CompanyHOAddres:['', Validators.required],
      CompanyProjectOffi:['', Validators.required],
      CompanyLogo:['', Validators.required],
      CompanyGST:['', Validators.required],
      CompanyType:['', Validators.required],
      ProjectSubscription:['', Validators.required]

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
