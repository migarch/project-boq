import { MatTableDataSource } from "@angular/material/table";

export interface LineItems{
    id:string;
    LineItemDescription:string;
    Qty:string;
    Unit:string;
    Rate:string;
    Amount:string;
    Remarks:string;
    IsSubLineItem:string;
    ShortCode:string;
    lineitems?:LineItems[] | MatTableDataSource<any>;
}