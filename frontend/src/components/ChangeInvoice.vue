<template>
  <div>
      <v-card>
          <v-card-actions>
              <v-card-title>All Invoices</v-card-title>
              <v-spacer></v-spacer>
              <v-text-field label="Search" v-model="search"></v-text-field>
          </v-card-actions>
          <v-data-table
          :items="allNotes"
          :headers="noteHeaders"
          :search="search">
            <template v-slot:item.controls="{item}">
                <v-btn icon @click="viewInvoice(item.id)" >
                    <v-icon>mdi-file-document</v-icon>
                </v-btn>
            </template>
          </v-data-table>
          <v-dialog max-width="60rem" v-model="print_invoice_dialog">
              <v-toolbar dark>
                  <v-toolbar-title>Invoice</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn @click="print_invoice_dialog = false" icon>
                      <v-icon>mdi-close</v-icon>
                  </v-btn>
              </v-toolbar>
              <final :invoice="print_invoice_id" />
          </v-dialog>
      </v-card>
  </div>
</template>

<script>
import InvoiceService from '../InvoiceService'
import Final from './transactions/invoice/Final.vue'
export default {
    components:{
        Final
    },
    name:"ChangeInvoice",
    data() {
        return {
            allNotes:[],
            search:'',
            noteHeaders:[
                {
                    text:"",
                    value:"controls"
                },
                {
                    text:"ID",
                    value:"id"
                },
                {
                    text:'Type',
                    value:'type'
                },{
                    text:'Date',
                    value:'date'
                },{
                    text:"Order",
                    value:"prevdoc"
                },{
                    text:'Customer',
                    value:'name'
                },{
                    text:'E-mail',
                    value:'email'
                },{
                    text:"Telephone",
                    value:"telephone"
                },{
                    text:'Total',
                    value:'total'
                },{
                    text:'Discount',
                    value:'discount'
                },{
                    text:'Final',
                    value:'final'
                }
            ],
            print_invoice_id:null,
            print_invoice_dialog:false,
        }
    },
    methods: {
        viewInvoice(id){
            this.print_invoice_id = id;
            this.print_invoice_dialog = true
        }
    },

    async created() {
        this.allNotes = await InvoiceService.GETAllInvoices()
    },

}
</script>

<style>

</style>