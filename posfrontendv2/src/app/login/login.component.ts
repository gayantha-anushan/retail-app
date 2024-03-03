import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private router : Router){
    var token : String | null = localStorage.getItem("saved_token")
    if(token != null){
      router.navigateByUrl('/dashboard')
    }
  }

  onLoginClicked(){
    alert("Login Clicked")
  }
}
