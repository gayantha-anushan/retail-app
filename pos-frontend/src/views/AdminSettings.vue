<script setup>
import LogoMine from '../assets/logo-mine.png'
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
                    <span class="self-center whitespace-nowrap">Administration Settings</span>
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
            <div id="main-content" class="h-full w-full bg-gray-50 dark:bg-gray-950 relative overflow-y-auto " >
                <main class="text-black dark:text-white">
                    <div class="grid grid-cols-1 gap-10 md:grid-cols-2 ">
                        <div class="p-3 flex items-center justify-center">
                            <input type="file" name="item-excel"/>
                            <button>Item Upload</button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    </div>
</template>