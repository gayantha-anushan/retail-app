<template>
  <v-main>
        <v-container class="margin_top_setup" fluid ma-0 pa-0 >
      <v-row>
        <v-col cols="6" xs="6" sm="6" md="3" lg="3" xl="3" class="border_simplex">
          <v-card style="padding:1rem" flat>
            <v-text-field v-model="ret_date" label="Returned Date" type="date"></v-text-field>
            <v-text-field v-model="reference" label="Reference"></v-text-field>
          </v-card>
        </v-col>
        <v-col cols="6" xs="6" sm="6" md="3" lg="3" xl="3" class="border_simplex">
          <v-card flat>
            <v-card-actions>
              <v-text-field v-on:keyup.enter="load_grn()" v-model="grn_id" label="GRN NO:"></v-text-field>
              <v-spacer></v-spacer>
              <button @click="load_grn()" class="new_btn_style">Add</button>
            </v-card-actions>
            <p v-if="grn != null">
              <b>GRN id : </b><span>{{grn.id}}</span><br/>
              <b>Total : </b><span>{{grn.total}}</span><br/>
              <b>GRN Taxes ( {{grn.vat_percentage}} )  : </b><span>{{grn.vat_amount}}</span><br/>
              <b>GRN Discounts ( {{grn.discount}} )  : </b><span>{{grn.disc_amount}}</span><br/>
              <b>GRN Final : </b><span>{{grn.final}}</span>
            </p>
          </v-card>
        </v-col>
        <v-col cols="6" xs="6" sm="6" md="3" lg="3" xl="3" class="border_simplex">
          <v-card flat>
            <v-card-actions>
              <v-chip label>Total : {{total_amount.toFixed(2)}}</v-chip>
              <v-spacer></v-spacer>
              <v-chip label>Final : {{final_amount.toFixed(2)}}</v-chip>
            </v-card-actions>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="addItemDialog = true" dark style="margin-left:10px">Add Item List</v-btn>
            </v-card-actions>
            <v-card-actions>
              <v-chip label>Discount : {{disc_am.toFixed(2)}}</v-chip>
              <v-spacer></v-spacer>
              <v-chip label>VAT : {{vat_am.toFixed(2)}}</v-chip>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="6" xs="6" sm="6" md="3" lg="3" xl="3" class="border_simplex">
          <v-card flat>
            <p v-if="grn != null">
              <b>Supplier ID : </b><span>{{grn.stakeholder}}</span><br/>
              <b>Supplier Name : </b><span>{{grn.st_name}}</span><br/>
              <b>Supplier Address : </b><span>{{grn.address1}}<br>{{grn.address2}}<br>{{grn.address3}}</span><br/>
              <b>Supplier email : </b><span>{{grn.email}}</span><br/>
              <b>Supplier Telephone : </b><span>{{grn.telephone}}</span><br/>
            </p>
          </v-card>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="9" lg="9" xl="9" >
          <v-card flat>
            <v-card-actions>
              <v-card-title>Returned Items</v-card-title>
              <v-spacer></v-spacer>
              <v-text-field v-model="addedItemSearch" label="Search"></v-text-field>
            </v-card-actions>
            <v-data-table
            :headers="grn_item_headers"
            :search="addedItemSearch"
            :items="addedItems">
              <template v-slot:item.controls="{item}">
                  <v-btn small icon  @click.stop="edit_items(item)">
                  <v-icon dark>mdi-book-edit</v-icon>
                  </v-btn>&nbsp;
                  <v-btn small icon  @click.stop="delete_items(item)">
                  <v-icon dark>mdi-delete</v-icon>
                  </v-btn>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="3" lg="3" xl="3" >
          <v-card flat>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="clean()" text>Clear</v-btn>
              <v-btn @click="generate()" dark>Generate</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
            <v-textarea v-model="remarks" label="Remarks" outlined></v-textarea>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="addItemDialog" max-width="50rem">
      <v-card flat>
        <v-card-actions>
          <v-card-title>Add Item</v-card-title>
          <v-spacer></v-spacer>
          <v-text-field v-model="searchdata" label="Search"></v-text-field>
        </v-card-actions>
        <v-data-table
        :search="searchdata"
        :items="grn_items"
        :headers="grn_item_headers">
        <template v-slot:item.controls="{item}">
            <v-btn small icon  @click.stop="add_item(item)">
            <v-icon dark>mdi-plus-circle</v-icon>
            </v-btn>
        </template>
        </v-data-table>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="addItemDialog = false" text>Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editItemDialog" max-width="20rem">
      <v-card style="padding:1rem">
        <v-card-title>Edit</v-card-title>
        <v-text-field label="Quantity" v-model="quantity"></v-text-field>
        <v-btn @click="change_item_data()">Change</v-btn>
      </v-card>
    </v-dialog>
    <v-dialog v-model="gpDialog">
      <v-card flat>
        <v-toolbar dark>
          <v-toolbar-title>Purchase Return Print</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn @click="gpDialog = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <GRENPrint :id="gpid"/>
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
import DocumentService from '../../Document'
import Common from '../../Common'
import ItemReturnService from '../../ItemReturnService'
import GRENPrint from '../transactions/print/GRENPrint.vue'

export default {
    name:"GREN",
    components:{
      GRENPrint
    },
    data(){
      return{
        gpid:-1,
        gpDialog:false,
        stage_item:null,
        quantity:'',
        editItemDialog:false,
        final_amount:0,
        change_amount:0,
        reference:'',
        searchdata:'',
        addedItemSearch:'',
        disc_am:0,
        vat_am:0,
        grn_id:'',
        snackbar:false,
        total_amount:0,
        timeout:2000,
        addItemDialog:false,
        error:'',
        grn:null,
        remarks:'',
        ret_date:'',
        grn_items:[],
        grn_item_headers:[
          {
            text:'',
            value:"controls"
          },{
            text:"ID",
            value:"item"
          },{
            text:"Code",
            value:"code"
          },{
            text:"Name",
            value:"name"
          },{
            text:"Unit",
            value:"unit"
          },{
            text:"Unit Price",
            value:"unit_price"
          },
          {
            text:"Quantity",
            value:"quantity"
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
        addedItems:[],
      }
    },
    watch:{
      'total_amount':function(){
        this.calculate_final_amount();
      },
    },
    methods:{
      calculate_final_amount(){
        if(this.grn != null){
          this.final_amount = this.total_amount
          if(this.grn.discount != null && this.grn.discount != ""){
            this.final_amount = Common.discounting(this.total_amount,this.grn.discount);
          }
          this.disc_am = this.final_amount - this.total_amount;
          if(this.grn.vat_percentage != null && this.grn.vat_percentage != ""){
            var vv = this.grn.vat_percentage;
            var vx = vv.split('%');
            this.vat_am = Number(this.final_amount)*(Number(vx[0])/100);
            this.final_amount = Number(this.final_amount) + Number(this.vat_am);
          }
        }
      },
      async load_grn(){
        if(this.grn_id == ''){
          //send error message
          this.error = "Please Insert Grn ID";
          this.snackbar = true;
        }else{
          var allData = await DocumentService.GetFinalGrnAllData(this.grn_id);
          this.grn_id = ''
          this.grn = allData.grn;
          this.grn_items = allData.items;
        }
      },
      add_item(item){
        this.addedItems = this.addedItems.concat(item);
        this.addItemDialog = false;
        this.calculate_total_amount()
      },
      edit_items(item){
        this.editItemDialog = true
        this.stage_item = item;
      },
      change_item_data(){
        for(var i = 0 ; i < this.addedItems.length ; i++){
          if(this.addedItems[i].id == this.stage_item.id){
            if(Number(this.addedItems[i].quantity) >= Number(this.quantity)){
              this.addedItems[i].quantity = this.quantity;
            }else{
             this.error = "Cannot exceed received limit";
             this.snackbar = true;
            }
          }
        }
        this.editItemDialog = false;
        this.calculate_total_amount()
      },
      calculate_total_amount(){
        var totals = 0;
        for(var i = 0 ; i < this.addedItems.length ; i++){
          this.addedItems[i].total = Number(this.addedItems[i].quantity)*Number(this.addedItems[i].unit_price);
          this.addedItems[i].final = Common.discounting(this.addedItems[i].total,this.addedItems[i].discount);
          totals += Number(this.addedItems[i].final);
        }
        this.total_amount = totals
      },
      clean(){
        this.ret_date = ''
        this.reference = ''
        this.remarks = ''
        this.stage_item = null
        this.addedItemSearch = ''
        this.grn_id = ''
        this.total_amount = 0
        this.grn = null
        this.grn_items = []
        this.addedItems = []
      },
      async generate(){
        if(this.ret_date != ''){
          if(this.addedItems.length > 0){
            const data = {
              rdate:this.ret_date,
              edate:new Date().toISOString().slice(0,10),
              ref:this.reference,
              rem:this.remarks,
              grn:this.grn,
              items:this.addedItems,
              total_am:this.total_amount,
              disc_perc:this.grn.discount,
              vat_perc:this.grn.vat_percentage,
              disc_am:this.disc_am,
              vat_am:this.vat_am,
              final_amount:this.final_amount
            }
            var resuu = await ItemReturnService.PurchaseReturnNote(data);
            this.gpid = resuu.id;
            this.gpDialog = true;
            this.clean();
          }else{
            this.error = "Add Least One Item"
            this.snackbar = true;
          }
        }else{
          this.error = "Error Occured Please enter date correctly"
          this.snackbar = true;
        }
      },
      delete_items(item){
        for(var i = 0 ; i < this.addedItems.length ; i++){
          if(this.addedItems[i].id == item.id){
            this.addedItems.splice(i,1);
          }
        }
        this.calculate_total_amount()
      }
    }
}
</script>

<style>
.margin_top_setup{
    margin-top: 5px;
}
.new_btn_style{
    padding:8px;
    margin:0;
    color:#ffffff;
    font-size: 15px;
    background-color: grey;
    margin:5px
}
.border_simplex{
    border:1px solid #c2c3c4
}
.center_items{
    display:flex;
    justify-content: space-around;
}
.dark_color{
    color:#4f4f4f;
}
</style>