<script setup>
const props = defineProps(["FormStructure","content","TbConfig","onRowEdit","onRowDelete","onRowView"])
</script>

<template>
    <div class="hidden md:block">
        <table class=" w-full">
        <thead class="bg-gray-50 dark:bg-gray-950 border-b-2 border-gray-200 dark:border-l-gray-800">
            <tr class=" text-black dark:text-white">
                <td v-if="TbConfig != null" ></td>
                <th v-for="fss in FormStructure" class="p-3 text-sm font-semibold tracking-wide text-left">{{ fss.title }}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="con in content" class="border-b-2 border-gray-100 dark:border-gray-900"> 
                <td v-if="TbConfig != null" >
                    <button v-on:click="onRowDelete" class="m-1 p-2 rounded-full" v-if="TbConfig.isContentDeleteButton">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_11_5667)">
                                <path d="M6 21H18V7H6V21ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="#323232"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_11_5667">
                                    <rect width="24" height="24" fill="white"/>
                                </clipPath>
                            </defs>
                        </svg>
                    </button>
                    <button v-on:click="onRowEdit" class="m-1 p-2 rounded-full" v-if="TbConfig.isContentEditButton">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_17_20115)">
                                <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM21.41 6.34L17.66 2.59L15.13 5.13L18.88 8.88L21.41 6.34Z" fill="#323232"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_17_20115">
                                    <rect width="24" height="24" fill="white"/>
                                </clipPath>
                            </defs>
                        </svg>
                    </button>
                    <button v-on:click="onRowView" class="m-1 p-2 rounded-full" v-if="TbConfig.isContentViewButton">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_11_4074)">
                                <path d="M19 19H5V5H12V3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V12H19V19ZM14 3V5H17.59L7.76 14.83L9.17 16.24L19 6.41V10H21V3H14Z" fill="#323232"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_11_4074">
                                    <rect width="24" height="24" fill="white"/>
                                </clipPath>
                            </defs>
                        </svg>
                    </button>
                </td>
                <td v-for="fs in FormStructure" class="p-3 text-sm text-gray-700 dark:text-gray-300">{{ con[fs.field] }}</td>
            </tr>
        </tbody>
    </table>
    </div>
</template>