import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthRequest } from '../models/auth-request';
import { AuthResponse } from '../models/auth-response';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

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

  Authenticate(user : AuthRequest){
    return this.http.post<AuthResponse>("/users/login",user).pipe(
      catchError(this.handleError)
    )
  }
}
