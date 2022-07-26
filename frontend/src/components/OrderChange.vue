<template>
    <v-card>
      <v-card-actions>
          <v-card-title>Purchase Orders</v-card-title>
          <v-spacer></v-spacer>
          <v-text-field label='Search' v-model="searchTerm" width="10rem"></v-text-field>    
      </v-card-actions>
      <v-data-table
      :search="searchTerm"
      :items="allOrders"
      :headers="allOrdersHeader"
      >
        <template v-slot:item.controls="{item}">
            <div>
                <v-btn @click="view_po(item.id)" icon>
                    <v-icon>mdi-file-document</v-icon>
                </v-btn>
            </div>
        </template>
      </v-data-table>
      <v-dialog v-model="po_dialog" max-width="60rem" >
          <v-card>
              <v-toolbar dark>
                  <v-toolbar-title>Purchase Order</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn @click="po_dialog = false" icon>
                      <v-icon>mdi-close</v-icon>
                  </v-btn>
              </v-toolbar>
              <POPrint :id="po_id" />
          </v-card>
      </v-dialog>
    </v-card>
</template>

<script>
import OrderService from '../OrderService';
import POPrint from './transactions/POPrint.vue'

export default {
    name:"OrderChange",
    components:{
        POPrint
    },
    data() {
        return {
            //add data here
            allOrders:[],
            searchTerm:"",
            allOrdersHeader:[
                {
                    text:"",
                    value:"controls",
                },
                {
                    text:"ID",
                    value:"id"
                },
                {
                    text:"Supplier",
                    value:"name"
                },
                {
                    text:"Required",
                    value:"required"
                },
                {
                    text:"Requested",
                    value:"requested"
                },
                {
                    text:"Total",
                    value:"total"
                },
                {
                    text:"Discount",
                    value:"discount"
                },
                {
                    text:"Final",
                    value:"final"
                }
            ],
            po_id:null,
            po_dialog:false
        }
    },
    methods: {
        view_po(id){
            this.po_id = id;
            this.po_dialog = true;
        }
    },
    async created() {
        this.allOrders = await OrderService.GETAllOrders();
    },
}
</script>

<style>

</style>