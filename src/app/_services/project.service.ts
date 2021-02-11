import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({ providedIn:'root'})

export class ProjectService{
    constructor(private http: HttpClient){ }

    getBuildingList(params){
        return this.http.get<any>(`${environment.apiUrl}/api/fetch_building`,{params})
    }

    addBuilding(row_obj){
        return this.http.post<any>(`${environment.apiUrl}/api/add_building`, row_obj)
    }

    getBuildingItems(params){
        return this.http.get<any>(`${environment.apiUrl}/api/fetch_item`,{params})
    }

    addBuildingItems(row_obj){
        return this.http.post<any>(`${environment.apiUrl}/api/add_item`, row_obj)
    }

    getLineItems(params){
        return this.http.get<any>(`${environment.apiUrl}/api/fetch_lineitem`,{params})
    }

    getCopyBulding(row_obj){
        return this.http.post<any>(`${environment.apiUrl}/api/get_buildings`, row_obj);
    }

    getCopyItems(Id){
        let params = {building_id:Id}
        return this.http.get<any>(`${environment.apiUrl}/api/fetch_item`,{params})
    }

    copySelectedItem(copy_paste_items){
        return this.http.post<any>(`${environment.apiUrl}/api/copy_paste_items`, copy_paste_items)
    }


}