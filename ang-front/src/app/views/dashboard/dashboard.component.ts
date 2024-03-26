import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  constructor(private router : Router){}

  OnLogOutPressed(){
    localStorage.removeItem("TOKEN_AUTH")
    this.router.navigate([""])
  }
}
