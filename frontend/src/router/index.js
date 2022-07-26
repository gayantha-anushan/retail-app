import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Dashboard from '../views/Dashboard.vue'
import Settings from '../views/Settings.vue'
import Transactions from '../views/Transactions.vue'
import StockReport from '../views/StockReport.vue'
import PettyCash from '../views/PettyCash.vue'
import Add from '../views/Add.vue';
import Reports from '../components/Reports.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path:'/reports',
    name:'Reports',
    component:Reports
  },
  {
    path:'/pettycash',
    name:'PettyCash',
    component:PettyCash
  },
  {
    path:'/dashboard',
    name:'Dashboard',
    component:Dashboard
  },
  {
    path:'/settings',
    name:'Settings',
    component:Settings,
    props:true
  },
  {
    path:'/str',
    name:"Stock Report",
    component:StockReport,
  },
  {
    path:'/add/:selection',
    name:'Add',
    component:Add,
    props:true,
  },
  {
    path:'/transactions/:docutype',
    name:'Transactions',
    component:Transactions,
    props:true
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
