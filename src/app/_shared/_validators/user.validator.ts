import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AbstractControl, AsyncValidatorFn } from "@angular/forms";
import { Observable, timer } from "rxjs";
import { map, switchMap } from 'rxjs/operators';
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })

export class UserValidators {
  constructor(private http: HttpClient) {
  }

  searchEmail(text) {
    return timer(1000)
      .pipe(
        switchMap(() => {
          // Check if username is available
          return this.http.get<any>(`${environment.apiUrl}/api/check_email_exists?Email=${text}`)
        })
      );
  }

  emailValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this.searchEmail(control.value)
        .pipe(
          map(res => {
            // if username is already taken
            if (res) {
              return { 'emailExist': true };
            }
          })
        );
    };

  }


  searchPhone(text) {
    return timer(1000)
      .pipe(
        switchMap(() => {
          // Check if username is available
          return this.http.get<any>(`${environment.apiUrl}/api/check_phone_exists?PhoneNumber=${text}`)
        })
      );
  }

  phoneValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this.searchPhone(control.value)
        .pipe(
          map(res => {
            // if username is already taken
            if (res) {
              return { 'phoneExist': true };
            }
          })
        );
    };
  }
}