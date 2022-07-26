<template>
  <v-main>
    <v-container fluid ma-0 pa-0>
      <v-row>
        <v-col class="border_simplex" style="padding:2rem" cols="12" xs="12" sm="6" md="3" lg="3" xl="3">
            <v-card flat>
              <v-text-field outlined type="date" v-model="retdate" label="Returned Date" ></v-text-field>
              <v-text-field outlined v-model="reference" label="Reference"></v-text-field>
            </v-card>
        </v-col>
        <v-col class="border_simplex" style="padding:2rem" cols="12" xs="12" sm="6" md="3" lg="3" xl="3">
           <v-card flat>
             <v-card-actions>
                <v-text-field label="invoice" v-on:keyup.enter="AddInvoiceer()" v-model="invoice_id" ></v-text-field>
                <v-spacer></v-spacer>
                <v-btn @click="AddInvoiceer()"  dark>Add</v-btn>
              </v-card-actions>
           </v-card>
        </v-col> 
        <v-col class="border_simplex" style="padding:2rem" cols="12" xs="12" sm="6" md="4" lg="3" xl="3">
          <v-text-field outlined type="number" v-model="released" step="0.01" label="Released Amount"></v-text-field>
        </v-col>
        <v-col class="border_simplex" style="padding:2rem" cols="12" xs="12" sm="6" md="4" lg="3" xl="3">
          <div v-if="invoice != null">
            <b>ID : </b><span>{{invoice.id}}</span><br>
            <b>Type : </b><span>{{invoice.type}}</span><br>
            <b>Total : </b><span>{{invoice.total}}</span><br>
            <b>Discount : </b><span>{{invoice.discount}}</span><br>
             <b>Final : </b><span>{{invoice.final}}</span><br>
              
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col style="padding:2rem" cols="12" xs="12" sm="12" md="9" lg="9" xl="9">
          <v-card flat>
              <v-card-actions>
                <v-card-title>Returned Items</v-card-title>
                <v-spacer></v-spacer>
                <v-text-field label="Search on List " v-model="searchItem"></v-text-field>
              </v-card-actions>
              <v-data-table
              :items="allInvoiceItems"
              :headers="allItemHeader"
              item-key="_id">
                <template v-slot:item.controls="{item}">
                    <v-btn small icon  @click.stop="edit_item(item)">
                    <v-icon dark>mdi-book-edit</v-icon>
                    </v-btn>
                    <v-btn icon small  @click.stop="delete_item(item)">
                    <v-icon dark>mdi-delete</v-icon>
                    </v-btn>
                </template>
              </v-data-table>
            </v-card>
        </v-col>
        <v-col style="padding:2rem" cols="12" xs="12" sm="12" md="3" lg="3" xl="3">
           <v-btn  @click="clear()" text>Clean</v-btn>
            <v-btn  @click="generate()" dark>Generate</v-btn>
             <v-textarea style="margin:1rem" outlined v-model="reason" label="Reason"></v-textarea>
        </v-col>
      </v-row>
    </v-container>  
    <v-dialog v-model="changeItemDialog" max-width="20rem">
      <v-card style="padding:1rem">
        <v-card-title>Change Item</v-card-title>
        <v-text-field v-model="quantity" label="Quantity" type="number" step="0.001" outlined></v-text-field>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="success_change_quantity()" text>Change</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="printable_dialog" max-width="60rem">
      <v-card>
        <v-toolbar dark>
          <v-toolbar-title>Item Return Note</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="printable_dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <ItemReturnPrint :id="printable_doc" />
      </v-card>
    </v-dialog>
      <v-snackbar v-model="snackbar" :timeout="timeout">
        {{error}}
        <template v-slot:action="{ attrs }">
          <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">Close</v-btn>
        </template>
      </v-snackbar>
  </v-main>
</template>

<script>
import InvoiceService from '../InvoiceService'
import ItemReturnService from '../ItemReturnService'
import Common from '../Common'
import ItemReturnPrint from './transactions/print/ItemReturnPrint.vue'

export default {
//   name:"IretNote",
  components:{
    ItemReturnPrint
  },
  data() {
    return {
      snackbar:false,
      error:'',
      timeout:2000,
      retdate:'',
      editItemDialog:false,
      invoice_id:'',
      released:0,
      editQty:0,
      changeItemDialog:false,
      quantity:0,
      reason:'',
      reference:'',
      invoice:null,
      vats:[],
      invoice_items:[],
      allInvoiceItems:[],
      allItemHeader:[
        {
          text:"",
          value:"controls"
        },
        {
          text:"Item ID",
          value:"id"
        },{
          text:"Code",
          value:"code"
        },{
          text:"Item",
          value:"name"
        },{
          text:"Unit",
          value:"unit"
        },{
          text:"Quantity",
          value:"quantity"
        },{
          text:"Unit Price",
          value:"unit_price"
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
      searchItem:"",
      selectedItem:null,
      user:null,
      printable_doc:null,
      printable_dialog:false,
    }
  },
  created(){
    this.user = localStorage.getItem('UserToken');
  },
  methods: {
    async AddInvoiceer(){
      var invoice_data = await InvoiceService.ViewAllFinalInvoiceDetails(this.invoice_id);
      if(invoice_data.status){
        this.invoice = invoice_data.invoice;
        this.vats = invoice_data.vats;
        this.invoice_items = invoice_data.items;
        this.allInvoiceItems = this.invoice_items;
        this.calculate_amount();
      }else{
        this.error = "Invoice Not Found!";
        this.snackbar = true;
      }
    },
    calculate_amount(){
      //this.invoice.discount
      var amount = 0;
      for(var i = 0 ; i < this.allInvoiceItems.length ; i++){
        amount = Number(amount)+ Number(this.allInvoiceItems[i].final);
      }
      this.released = Common.discounting(amount,this.invoice.discount);
    },
    clear(){
      this.retdate = '';
      this.reference = '';
      this.invoice_id = '';
      this.invoice = null;
      this.released = 0;
      this.allInvoiceItems = [];
      this.reason = ''
      this.searchItem = ''
    },
    async generate(){
      var model = {
        date:new Date().toISOString().slice(0,10),
        user:this.user,
        return_date:this.retdate,
        reference:this.reference,
        invoice:this.invoice,
        released:this.released,
        items:this.allInvoiceItems,
        reason:this.reason
      }
      var id = await ItemReturnService.addNewReturnNote(model);
      this.printable_doc = id.id;
      this.printable_dialog = true;
      this.clear()
    },
    edit_item(item){
      this.quantity = item.quantity;
      this.selectedItem = item;
      this.changeItemDialog = true;
    },
    delete_item(item){
      for(var i = 0 ; i < this.allInvoiceItems.length ; i++){
        if(item.id == this.allInvoiceItems[i].id){
          this.allInvoiceItems.splice(i,1);
        }
      }
      this.calculate_amount()
    },
    success_change_quantity(){
      for(var i = 0 ; i < this.allInvoiceItems.length ; i++){
        if(this.selectedItem.id == this.allInvoiceItems[i].id){
          this.allInvoiceItems[i].quantity = Number(this.quantity).toFixed(3);
          this.allInvoiceItems[i].total = Number(this.allInvoiceItems[i].quantity)*Number(this.allInvoiceItems[i].unit_price);
          this.allInvoiceItems[i].final = Common.discounting(this.allInvoiceItems[i].total,this.allInvoiceItems[i].discount)
        }
      }
      this.calculate_amount()
      this.changeItemDialog = false;
    }
  },
}
</script>

<style>
.top-table{
  padding:1rem;
}
.margin_top_setup{
    margin-top: 5px;
}
.new_btn_style{
    padding:8px;
    margin:0;
    color:#ffffff;
    font-size: 15px;
    background-color: grey;
    margin:1px
}
.border_simplex{
    border:1px solid #c2c3c4;
}
.center_items{
    display:flex;
    justify-content: space-around;
}
.dark_color{
    color:#4f4f4f;
}
</style>