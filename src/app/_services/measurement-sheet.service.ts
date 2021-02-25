import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({ providedIn:'root'})

export class MeasurmentService{
    constructor(private http: HttpClient){ }

    onGetAllMeasurement(params){
        return this.http.get<any>(`${environment.apiUrl}/api/fetch/measurementsheet`,{params})
    }

    onInsertMeasurment(row_obj){
        return this.http.post<any>(`${environment.apiUrl}/api/measurementsheet/insert`, row_obj)
    }

    oncopyMeasurementLine(rowId){
        return this.http.post<any>(`${environment.apiUrl}/api/duplicate/measurementsheet`, rowId)
    }

}