import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-stakeholders',
  standalone: true,
  imports: [],
  templateUrl: './stakeholders.component.html',
  styleUrl: './stakeholders.component.css'
})
export class StakeholdersComponent implements OnInit {
  constructor(private route : ActivatedRoute){}

  ContentType : String | undefined

  ngOnInit(): void {
      const routeParams = this.route.snapshot.paramMap
      this.ContentType = String(routeParams.get('type'))
  }
}
