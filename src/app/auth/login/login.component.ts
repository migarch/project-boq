import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services';
import { Role, User } from 'src/app/shared';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm:FormGroup;
  loading = false;
  submitted = false;
  error = '';
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
    
  ) { }

  ngOnInit(): void {

    this.loginForm = this.formBuilder.group({
      email:['', Validators.email],
      password:['', Validators.required]
    })
  }

  get f() { return this.loginForm.controls; }

  OnSubmit(){
     this.submitted = true;

     if(this.loginForm.invalid){
       return;
     }

     this.loading = true;
     this.authenticationService.login(this.f.email.value, this.f.password.value)
     .pipe(first())
     .subscribe({
        next: () => {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigateByUrl(returnUrl);
        },
        error: error =>{
          this.error = error;
          this.loading = false;
        }
     });
  }

}
