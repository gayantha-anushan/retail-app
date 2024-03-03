import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthRequest } from '../models/auth-request';
import { Observable } from 'rxjs';
import { AuthResponse } from '../models/auth-response';
import { Urls } from '../constants/urls';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http:HttpClient) { }

  Login(request : AuthRequest) : Observable<AuthResponse>{
    return this.http.post<AuthResponse>(Urls.loginUrl,request,)
  }
}
