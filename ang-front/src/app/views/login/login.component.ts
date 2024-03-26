import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthRequest } from '../../models/auth-request';
import { FormControl,ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  username = new FormControl('')
  password = new FormControl('')

  constructor(private userService:UserService,private router : Router){}

  OnLoginButtonPressed(){
    var user : AuthRequest = {
      username : this.username.value != null ? this.username.value : "",
      password : this.password.value != null ? this.password.value : ""
    }
    this.userService.Authenticate(user).subscribe(
      response => {
        if(response.isLoginSuccess){
          localStorage.setItem("TOKEN_AUTH",response.token)
          this.router.navigate(['Dashboard'])
        }else{
          //Unsuccessful Login
        }
      }
    )
  }

}
//this.heroesService
// .addHero(newHero)
// .subscribe(hero => this.heroes.push(hero));