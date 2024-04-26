import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { Category, Type } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http : HttpClient) { }

  private handleError(error : HttpErrorResponse){
    if(error.status === 0){
      console.error("An Error Occured!",error.error)
    }else{
      console.error(error.error)
    }

    return throwError(()=>{
      new Error("Something happened please try again!")
    })
  }

  InsertCategory(category : Category){
    //
  }

  InsertType(type : Type){
    //
  }
}
