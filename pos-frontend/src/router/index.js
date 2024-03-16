import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DashboardView from '@/views/DashboardView.vue'
import Categories from '@/views/Categories.vue'
import Items from '@/views/Items.vue'
import Stakeholders from '@/views/Stakeholders.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path:'/dashboard',
      name:'Dashboard',
      component:DashboardView
    },{
      path:'/',
      name:'Categories',
      component:Categories
    },{
      path:'/items',
      name:'Items',
      component:Items
    },
    {
      path:'/stake/:code', // Add the parameter ":code" to the path
      name:"stakeholder",
      component:Stakeholders
    }
  ]
})

router.beforeEach(async (to,from)=>{
  var tkn = localStorage.getItem("AUTH_KEY")
  var isAuth = false;
  if(tkn == null || tkn == undefined || tkn == ""){
    isAuth = false;
  }else{
    isAuth = true
  }
  if( !isAuth && to.name !== 'home'){
    return {name:'home'}
  }
})

export default router
