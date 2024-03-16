<script setup>
import LogoMine from '../assets/logo-mine.png'
import Common from '@/services/Common';
import { ref } from 'vue';
import getMenuData from '@/data/MenuData';

var isShowSidebar = ref(false);
var currentPosMenu = ref([])

currentPosMenu.value = getMenuData()

function changeSidebar(){
    this.isShowSidebar = !this.isShowSidebar
    console.log(isShowSidebar)
}

function GetFilteredMenu(type){
    var menu = getMenuData()
    var filteredMenu = menu.filter(mn => mn.type == type)
    currentPosMenu.value = filteredMenu
    isShowSidebar.value = true
}
</script>

<template>
<div style="height: 100vh;" class=" bg-gray-50 dark:bg-gray-950">
   <nav class="bg-white border-b border-gray-200 dark:border-gray-800 fixed z-30 w-full dark:bg-gray-950 dark:text-white">
      <div class="px-3 py-3 lg:px-5 lg:pl-3">
         <div class="flex items-center justify-between">
            <div class="flex items-center justify-start">
               <button @click="changeSidebar()" class="mr-2 text-gray-300 dark:text-gray-700 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-900 focus:bg-gray-100 dark:focus:bg-gray-900 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-900 rounded">
                  <svg id="toggleSidebarMobileHamburger" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                     <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
                  </svg>
                  <svg id="toggleSidebarMobileClose" class="w-6 h-6 hidden" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                     <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
               </button>
               <a href="#" class="text-xl font-bold flex items-center lg:ml-2.5">
               <img :src="LogoMine" class="h-6 mr-2" alt="SNS Pos Logo">
               <span class="self-center whitespace-nowrap">SNS Pos</span>
               </a>
               <form action="#" method="GET" class="hidden lg:block lg:pl-32">
                  <label for="topbar-search" class="sr-only">Search</label>
                  <div class="mt-1 relative lg:w-64">
                     <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                           <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path>
                        </svg>
                     </div>
                     <input type="text" name="email" id="topbar-search" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full pl-10 p-2.5" placeholder="Search">
                  </div>
               </form>
            </div>
            <div class="flex items-center">
               <button id="toggleSidebarMobileSearch" type="button" class="lg:hidden text-gray-500 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg">
                  <span class="sr-only">Search</span>
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                     <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path>
                  </svg>
               </button>
               <a href="#" class="hidden sm:inline-flex ml-5 text-white bg-indigo-500 hover:bg-indigo-600 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center items-center mr-3">
                  Log Out
               </a>
            </div>
         </div>
      </div>
   </nav>
   <div  class="flex overflow-hidden bg-white pt-16">
      <aside v-if="isShowSidebar == true" class="fixed hidden z-20 h-full top-0 left-0 pt-16 flex lg:flex flex-shrink-0 flex-col w-64 transition-width duration-75">
         <div class="relative flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-700 pt-0">
            <div class="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
               <div class="flex-1 px-3 bg-white dark:bg-gray-950 divide-y space-y-1">
                  <ul class="space-y-2 pb-2">
                     
                     <li v-for="mn in currentPosMenu" v-if="currentPosMenu.length > 0">
                        <a :href="mn.url" class="text-base text-gray-900 dark:text-gray-50 font-normal rounded-lg dark:hover:bg-gray-900 hover:bg-gray-100 flex items-center p-2 group ">
                           <!-- <div v-html="mn.icon"></div> -->
                           <span class="ml-3 flex-1 whitespace-nowrap">{{  mn.name }}</span>
                        </a>
                     </li>
                     
                  </ul>
               </div>
            </div>
         </div>
      </aside>
      <div class="bg-gray-900 opacity-50 hidden fixed inset-0 z-10" id="sidebarBackdrop"></div>
      <!-- lg:ml-64 -->
      <div id="main-content" class="h-full w-full bg-gray-50 dark:bg-gray-950 relative overflow-y-auto " :class="{'lg:ml-64':isShowSidebar}" >
         <main>
            <div class="pt-6 px-4">
               <div class="w-full grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">


               </div>
               <div class="mt-4 w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  <div v-on:click="GetFilteredMenu('CONF')" class="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
                     <div class="flex items-center">
                        <div class="flex-shrink-0">
                           <span class="text-2xl sm:text-3xl leading-none font-bold text-gray-900">Configurations</span>
                           <h3 class="text-base font-normal text-gray-500">Click Here for Items Menu</h3>
                        </div>
                        <div class="ml-5 w-0 flex items-center justify-end flex-1 text-green-500 text-base font-bold">
                           10
                        </div>
                     </div>
                  </div>

                  <div v-on:click="GetFilteredMenu('BUY')" class="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
                     <div class="flex items-center">
                        <div class="flex-shrink-0">
                           <span class="text-2xl sm:text-3xl leading-none font-bold text-gray-900">Supplies</span>
                           <h3 class="text-base font-normal text-gray-500">Click Here for Supplies Menu</h3>
                        </div>
                        <div class="ml-5 w-0 flex items-center justify-end flex-1 text-green-500 text-base font-bold">
                           11
                        </div>
                     </div>
                  </div>

                  <div v-on:click="GetFilteredMenu('SELL')" class="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
                     <div class="flex items-center">
                        <div class="flex-shrink-0">
                           <span class="text-2xl sm:text-3xl leading-none font-bold text-gray-900">Sales</span>
                           <h3 class="text-base font-normal text-gray-500">Click Here for Sales Menu</h3>
                        </div>
                        <div class="ml-5 w-0 flex items-center justify-end flex-1 text-green-500 text-base font-bold">
                           11
                        </div>
                     </div>
                  </div>

                  <div v-on:click="GetFilteredMenu('PAY')" class="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
                     <div class="flex items-center">
                        <div class="flex-shrink-0">
                           <span class="text-2xl sm:text-3xl leading-none font-bold text-gray-900">Payments</span>
                           <h3 class="text-base font-normal text-gray-500">Click Here for Payments Menu</h3>
                        </div>
                        <div class="ml-5 w-0 flex items-center justify-end flex-1 text-green-500 text-base font-bold">
                           11
                        </div>
                     </div>
                  </div>

                  <div v-on:click="GetFilteredMenu('STCR')" class="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
                     <div class="flex items-center">
                        <div class="flex-shrink-0">
                           <span class="text-2xl sm:text-3xl leading-none font-bold text-gray-900">Stock Report</span>
                           <h3 class="text-base font-normal text-gray-500">Click Here for Stock Report Menu</h3>
                        </div>
                        <div class="ml-5 w-0 flex items-center justify-end flex-1 text-green-500 text-base font-bold">
                           11
                        </div>
                     </div>
                  </div>

                  <div v-on:click="GetFilteredMenu('REP')" class="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
                     <div class="flex items-center">
                        <div class="flex-shrink-0">
                           <span class="text-2xl sm:text-3xl leading-none font-bold text-gray-900">Reports</span>
                           <h3 class="text-base font-normal text-gray-500">Click Here for Reports Menu</h3>
                        </div>
                        <div class="ml-5 w-0 flex items-center justify-end flex-1 text-green-500 text-base font-bold">
                           11
                        </div>
                     </div>
                  </div>

                  <div v-on:click="GetFilteredMenu('SET')" class="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
                     <div class="flex items-center">
                        <div class="flex-shrink-0">
                           <span class="text-2xl sm:text-3xl leading-none font-bold text-gray-900">Admin Settings</span>
                           <h3 class="text-base font-normal text-gray-500">Click Here for Settings Menu</h3>
                        </div>
                        <div class="ml-5 w-0 flex items-center justify-end flex-1 text-green-500 text-base font-bold">
                           11
                        </div>
                     </div>
                  </div>

                  <div v-on:click="GetFilteredMenu('PET')" class="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
                     <div class="flex items-center">
                        <div class="flex-shrink-0">
                           <span class="text-2xl sm:text-3xl leading-none font-bold text-gray-900">Petty Cash</span>
                           <h3 class="text-base font-normal text-gray-500">Click Here for Petty Cash Book</h3>
                        </div>
                        <div class="ml-5 w-0 flex items-center justify-end flex-1 text-green-500 text-base font-bold">
                           11
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </main>
         <p class="text-center text-sm text-gray-500 my-10">
            &copy; <a href="#" class="hover:underline" target="_blank">Smart Neural Solutions</a>. All rights reserved.
         </p>
      </div>
   </div>
</div>
</template>

<style></style>