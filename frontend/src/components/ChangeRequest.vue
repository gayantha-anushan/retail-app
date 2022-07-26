<template>
  <div>
      <v-card>
        <v-card-actions>
            <v-card-title>Item Request Notes</v-card-title>
            <v-spacer></v-spacer>
            <v-text-field label="Search" v-model="search"></v-text-field>
       </v-card-actions>    
        <v-data-table
        :items="allNotes"
        :headers="noteHeaders"
        :search="search">
        <template v-slot:item.controls="{item}">
            <v-btn @click="view_item_request(item.id)" icon>
                <v-icon>mdi-file-document</v-icon>
            </v-btn>
        </template>
        </v-data-table>
        <v-dialog v-model="print_dialog" max-width="60rem">
            <v-card>
                <v-toolbar dark>
                    <v-toolbar-title>Item Request</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="print_dialog = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <IREQPrint :id="print_id" />
            </v-card>
        </v-dialog>
      </v-card>
  </div>
</template>

<script>
import ItemReqService from '../ItemReqService'
import IREQPrint from './transactions/print/IREQPrint.vue'

export default {
    components:{
        IREQPrint
    },
    name:'ChangeRequest',
    data() {
        return {
            allNotes:[],
            noteHeaders:[
                {
                    text:"",
                    value:"controls"
                },
                {
                    text:"ID",
                    value:"id"
                },{
                    text:"Requested Date",
                    value:"reqdate"
                },{
                    text:"Customer",
                    value:"name"
                },{
                    text:"Customer E-mail",
                    value:"email"
                },{
                    text:"Customer Telephone",
                    value:"telephone"
                },{
                    text:"Reference",
                    value:"reference"
                },{
                    text:"Customer Reference",
                    value:"cusref"
                },{
                    text:"Total",
                    value:"total"
                },{
                    text:"Discount",
                    value:"discount"
                },{
                    text:"Final",
                    value:"final"
                }
            ],
            search:"",
            print_id:null,
            print_dialog:false,
        }
    },
    methods: {
        view_item_request(id){
            this.print_id = id;
            this.print_dialog = true
        }
    },
    async created() {
        this.allNotes = await ItemReqService.getAllRequests()
    },
}
</script>

<style>

</style>