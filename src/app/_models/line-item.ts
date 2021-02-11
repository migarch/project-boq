export interface LineItems{
    id:string;
    LineItemDescription:string;
    Qty:string;
    Unit:string;
    Rate:string;
    Amount:string;
    Remarks:string;
    IsSubLineItem:boolean;
    ShortCode:string;
    lineitem?:LineItems[];
}