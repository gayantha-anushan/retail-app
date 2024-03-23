<script setup>
import { onMounted } from 'vue';
import Grid from '@/components/Grid.vue';
import LogoMine from '../assets/logo-mine.png'
import { ref } from 'vue';
import router from '@/router';
import ItemService from '@/services/ItemService';

onMounted(() => {
   ItemService.GetAllAvailableItems()
      .then((response) => {
         items.value = response
      })
      .catch((error) => {
         console.log(error);
      });
});


function OnAddItemClick(){
   console.log('Add Item Clicked');
}

function NavigateToDashboard(){
    router.push('/dashboard')
}

const items = ref([]);
const showAddItemPopup = ref(true);

</script>

<template>
<div style="height: 100vh;" class=" bg-gray-50 dark:bg-gray-950">
   <nav class="bg-white border-b border-gray-200 dark:border-gray-800 fixed z-30 w-full dark:bg-gray-950 dark:text-white">
      <div class="px-3 py-3 lg:px-5 lg:pl-3">
         <div class="flex items-center justify-between">
            <div class="flex items-center justify-start">
               <button @click="NavigateToDashboard()" class="mr-2 text-gray-300 dark:text-gray-700 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-900 focus:bg-gray-100 dark:focus:bg-gray-900 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-900 rounded">
                <svg height="24" width="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_17_20342)">
                        <path d="M17.5098 3.86998L15.7298 2.09998L5.83984 12L15.7398 21.9L17.5098 20.13L9.37984 12L17.5098 3.86998Z" fill="#323232"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_17_20342">
                            <rect width="24" height="24" fill="white"/>
                        </clipPath>
                    </defs>
                </svg>
               </button>
               <a href="#" class="text-xl font-bold flex items-center lg:ml-2.5">
               <img :src="LogoMine" class="h-6 mr-2" alt="SNS Pos Logo">
               <span class="self-center whitespace-nowrap">SNS Pos</span>
               </a>
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
      <div class="bg-gray-900 opacity-50 hidden fixed inset-0 z-10" id="sidebarBackdrop"></div>
      <!-- lg:ml-64 -->
      <div id="main-content" class="h-full w-full bg-gray-50 dark:bg-gray-950 relative overflow-y-auto " >
         <main  class="text-black dark:text-white">
            <div class=" flex justify-between items-center ps-2 pe-2">
               <p class=" text-black dark:text-white text-xl font-bold" >Items</p>
               <form class=" flex w-96 rounded bg-white mt-2"> 
                  <input type="search"name="search" placeholder="search" class=" w-full border-none bg-transparent px-4 py-1 text-gray-900 outline-none focus:outline-none"/>
               </form>
            </div>
              <div class="hidden md:block m-5" >
               <table class=" w-full">
               <thead class="bg-gray-50 dark:bg-gray-950 border-b-2 border-gray-200 dark:border-l-gray-800">
                  <tr class=" text-black dark:text-white">
                     <td class="p-3 text-sm font-semibold tracking-wide text-left" >Category</td>
                     <td class="p-3 text-sm font-semibold tracking-wide text-left">Subcategory</td>
                     <td class="p-3 text-sm font-semibold tracking-wide text-left">Code</td>
                     <td class="p-3 text-sm font-semibold tracking-wide text-left">Name</td>
                     <td class="p-3 text-sm font-semibold tracking-wide text-left">Description</td>
                     <td class="p-3 text-sm font-semibold tracking-wide text-left">Unit</td>
                     <td class="p-3 text-sm font-semibold tracking-wide text-left">Quantity</td>
                     <td class="p-3 text-sm font-semibold tracking-wide text-left">Ordered Quantity</td>
                     <td class="p-3 text-sm font-semibold tracking-wide text-left">Price</td>
                     <td class="p-3 text-sm font-semibold tracking-wide text-left">Discount</td>
                     <td class="p-3 text-sm font-semibold tracking-wide text-left">Status</td>
                  </tr>
                  </thead>
                  <tbody>
                     <tr v-if="items.length > 0" v-for="itm in items" class="border-b-2 border-gray-100 dark:border-gray-900" >
                        <td class="p-3 text-sm text-gray-700 dark:text-gray-300">Category 1</td>
                        <td class="p-3 text-sm text-gray-700 dark:text-gray-300">Subcategory 1</td>
                        <td class="p-3 text-sm text-gray-700 dark:text-gray-300">001</td>
                        <td class="p-3 text-sm text-gray-700 dark:text-gray-300">Item 1</td>
                        <td class="p-3 text-sm text-gray-700 dark:text-gray-300">Description 1</td>
                        <td class="p-3 text-sm text-gray-700 dark:text-gray-300">Piece</td>
                        <td class="p-3 text-sm text-gray-700 dark:text-gray-300">10</td>
                        <td class="p-3 text-sm text-gray-700 dark:text-gray-300">5</td>
                        <td class="p-3 text-sm text-gray-700 dark:text-gray-300">$10.00</td>
                        <td class="p-3 text-sm text-gray-700 dark:text-gray-300">0%</td>
                        <td class="p-3 text-sm text-gray-700 dark:text-gray-300">In Stock</td>
                     </tr>
                  </tbody>
                  
               </table>
              </div>
              <div class="block md:hidden m-5">
               <!-- card content goes here -->
              </div>
              <!-- floating action button to add item-->
            <button class="fixed bottom-5 right-5 bg-indigo-500 hover:bg-indigo-600 focus:ring-4 focus:ring-cyan-200 text-white font-medium rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
               <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-on:click="OnAddItemClick()" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
               </svg>
            </button>
            <!-- Add Item Popup -->
            <div class="fixed inset-0 flex items-center justify-center z-40" v-if="showAddItemPopup">
               <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-96">
                  <h2 class="text-xl font-semibold mb-4">Add Item</h2>
                  <form>
                     <!-- Form fields go here -->
                     <div class="mb-4">
                        <label for="code" class="block text-sm font-medium text-gray-700">Code</label>
                        <input type="text" name="code" id="code" autocomplete="off" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                     </div>

                     <div class="mb-4">
                        <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" name="name" id="name" autocomplete="off" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                     </div>

                     <div class="mb-4">
                        <label for="price" class="block text-sm font-medium text-gray-700">Price</label>
                        <input type="number" name="price" id="price" autocomplete="off" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                     </div>
                  </form>
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