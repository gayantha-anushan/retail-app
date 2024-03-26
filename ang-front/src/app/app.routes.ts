import { Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { ItemsComponent } from './views/config/items/items.component';
import { CategoriesComponent } from './views/config/categories/categories.component';
import { StakeholdersComponent } from './views/config/stakeholders/stakeholders.component';

export const routes: Routes = [
    {path:'',component:LoginComponent},
    {path:'Dashboard',component:DashboardComponent},
    {path:'Items',component:ItemsComponent},
    {path:'Categories',component:CategoriesComponent},
    {path:'Stakeholders/:type',component:StakeholdersComponent}
];
