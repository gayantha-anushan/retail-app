<template>
  <v-main>
    <v-container fluid ma-0 pa-0 class="margin_top-setup">
      <v-row>
        <v-col cols="6" sm="6" xs="6" md="2" lg="2" class="border_simplex">
          <Type v-model="po_type" />
        </v-col>
        <v-col cols="6" sm="6" xs="6" md="4" lg="3" class="border_simplex">
          <button class="new_btn_style" @click="sellerAddDialog = true" style="width:100%" >Add Supplier</button>
          <p><b>Supplier : </b><span v-if="selectedStake.length > 0 ">{{selectedStake[0].name}}<br>
          {{selectedStake[0].email}}<br>
          {{selectedStake[0].telephone}}</span></p>
        </v-col>
        <v-col sm="6" cols="6" xs="6" md="3" lg="4" class="border_simplex">
          <v-text-field  type="date" label="Required Date"  v-model="required"></v-text-field>
          <v-text-field v-model="delterm" label="Delivery Term"></v-text-field>
          <v-text-field v-model="payterm" label="Payment Term"></v-text-field>
        </v-col>
        <v-col sm="6" cols="6" xs="6" md="3" lg="3" class="border_simplex">
          <v-card flat>
            <v-card-actions>
              <v-text-field v-model="reference"  label="Reference"></v-text-field>
              <v-text-field label="VAT Percentage" v-model="vat_percentage" ></v-text-field>
            </v-card-actions>
            <v-card-actions>
              <v-text-field outlined v-model="disc" label="Discount"></v-text-field>
              <v-spacer></v-spacer>
              <v-text-field outlined v-on:keyup.enter="barcode_add()" v-model="barcode" label="Barcode" style="margin-left:5px"></v-text-field>
            </v-card-actions>
            <v-card-actions>
              <v-chip label outlined  class="dark_color">Total : {{total.toFixed(2)}}</v-chip>
              <v-spacer></v-spacer>
              <v-chip label outlined  class="dark_color">Final : {{final.toFixed(2)}}</v-chip>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" xs="12" sm="12" md="8" lg="8" xl="8">
          <v-card flat style="padding:1rem">
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-text-field v-model="itemSearch" label="Search"></v-text-field>
              <v-btn fab dark @click="additemdialog = true"  small top right>
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-card-actions>
            <v-data-table
            :items="addedItems"
            item-key="item"
            :search="itemSearch"
            :headers="ItemHeader">
              <template v-slot:item.controls="{item}">
                <v-btn small icon @click.stop="edit_item(item)">
                  <v-icon dark>mdi-book-edit</v-icon>
                </v-btn>
                <v-btn small icon @click.stop="delete_item(item)">
                  <v-icon dark>mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-data-table>
            <v-divider></v-divider>
          </v-card>
        </v-col>
        <v-col style="padding:2rem" cols="12" xs="12" sm="12" md="4" lg="4" xl="4">
          <v-progress-linear v-if="progress" color="black" indeterminate height="5" striped style="margin-left:10px;margin-right:10px;margin-bottom:10px"></v-progress-linear>
          <v-btn @click="clear_added()" text>Clear</v-btn>&nbsp;
          <v-btn @click="upload_created_po()" dark>Generate</v-btn>
          <v-textarea v-model="remarks" outlined label="Remarks" style="margin:1rem"></v-textarea>
        </v-col>
      </v-row>
    </v-container>
      <v-dialog max-width="40rem" v-model="additemdialog">
        <v-card>
          <v-data-iterator
          :items="allItemsGot"
          :search="search_items_on_list"
          >
          <template v-slot:header>
            <v-toolbar dark>
              <v-text-field v-model="search_items_on_list" label="Search" clearable flat solo-inverted hide-details prepend-inner-icon="mdi-magnify"></v-text-field>
              <v-spacer></v-spacer>
              <v-btn @click="additemdialog = false" icon>
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
          </template>
          <template v-slot:default="props">
            <v-row style="margin:1rem">
              <v-col cols="12" sm="6" md="6" lg="4" :key="item.id" v-for="item in props.items">
                <v-card elevation="6">
                  <v-card-title class="subheading font-weight-bold">{{item.name}}</v-card-title>
                  <p style="text-align:center">Category : {{item.category_name}}<br/>
                  Sub Category : {{item.type_name}}<br/>
                  Unit Price : {{item.price}}<br/>
                  Available: {{item.quantity}}</p>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="add_me(item)" dark>Add</v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </template>
          </v-data-iterator>
        </v-card>
      </v-dialog>
      <v-dialog v-model="sellerAddDialog" max-width="40rem">
        <v-card style="padding:1rem">
          <v-card-actions>
            <v-card-title>Add Seller</v-card-title>
            <v-spacer></v-spacer>
            <v-text-field v-model="stakesearch"></v-text-field>
          </v-card-actions>
          <v-data-table
          :items="stakeholderlist"
          :headers="stakeheaders"
          v-model="selectedStake"
          :single-select="true"
          show-select
          item-key="id"
          :search="stakesearch"></v-data-table>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="sellerAddDialog = false" text>Cancel</v-btn>
            <v-btn @click="sellerAddDialog = false" color="primary" dark v-if="selectedStake.length > 0">Add</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="changeItemDialog" max-width="20rem">
        <v-card style="padding:1rem">
          <v-card-title>Change</v-card-title>
          <v-text-field v-model="itqty" label="Quantity"></v-text-field>
          <v-text-field v-model="itup" label="Unit Price"></v-text-field>
          <v-text-field v-model="itdisc" label="Discount"></v-text-field>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="changeItemDialog = false">Cancel</v-btn>
            <v-btn v-if="itqty != 0 && itup != 0" @click="change_item_data()" dark>Add</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- <POPrinter :dial.sync="printerdi" v-if="poid != null" :poid="poid"/> -->
      <v-dialog max-width="60rem" v-model="printerdi">
        <v-card>
          <v-toolbar dark>
            <v-toolbar-title>Purchase Order</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn @click="printerdi = false" icon>
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <POPrinter :id="poid"/>
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
import POPrinter from './POPrint.vue'
import Type from './invoice/Type.vue'
import ItemService from '../../ItemService'
import StakeService from '../../StakeService';
import Common from '../../Common'
import OrderService from '../../OrderService';
import InvoiceService from '../../InvoiceService'

 export default {
     name:"PurchaseOrder",
     components:{
       Type,POPrinter
     },
     data() {
       return {
        allItemsGot:[],
        po_type:'',
        printerdi:false,
        poid:null,
        additemdialog:false,
        itemSearch:"",
        total:0,
        vat_percentage:'',
        disc:"",
        final:0,
        itit:0,
        search_items_on_list:'',
        itqty:0,
        itup:0,
        itdisc:0,
        ittotal:0,
        itfinal:0.00,
        remarks:"",
        progress:false,
        selectedStake:[],
        payterm:'',
        required:"",
        addedItems:[],
        ItemHeader:[
          {
            text:"",
            value:"controls"
          },
          {
            text:"Code",
            value:"code"
          },
          {
            text:"Name",
            value:"itemname"
          },{
            text:"Quantity",
            value:"qty"
          },{
            text:"Unit Price",
            value:"up"
          },{
            text:"Total",
            value:"total"
          },{
            text:"Discount",
            value:"disc"
          },{
            text:"Final",
            value:"final"
          }
        ],
        stakeholderlist:[],
        stakeheaders:[
          {
            text:"Name",
            value:"name"
          },
          {
            text:"E-mail",
            value:"email"
          },
          {
            text:"Telephone",
            value:"telephone"
          }
        ],
        sellerAddDialog:false,
        stakesearch:"",
        snackbar:false,
        timeout:2000,
        error:"",
        reference:"",
        disc_am:"",
        vat_am:"",
        delterm:"",
        changeItemDialog:false,
        barcode:'',
        categories:[],
        vatList:[],
       }
     },
    async created() {
      this.stakeholderlist = await StakeService.GetAllStakes("Suppliers")
      this.user = localStorage.getItem('UserToken');
      this.allItemsGot = await ItemService.GetAllAvailableItems()
      this.categories = await ItemService.GETCategoriesWithNumType();
    },
    watch:{
      'total':function (){
        this.calculate_final();
      },
      'disc':function(){
        this.calculate_final();
      },
      'addedItems':function(){
        this.calculate_total();
      },
      'po_type':async function(){
        this.vatList = await InvoiceService.GETAllRelatedVats(this.po_type);
        this.add_percentage_vat()
      },
      'vat_percentage':function (){
        this.calculate_final();
      }
    },
    methods: {
      calculate_final(){
        this.final = Common.discounting(this.total,this.disc);
        this.disc_am = Number(this.final) - Number(this.total);
        this.final = this.calculate_new_vats(this.final);
      },
      calculate_new_vats(total){
        var str = this.vat_percentage
        var vt = str.split('%')
        var vt_amount = Number(total)*(Number(vt[0])/100);
        this.vat_am = vt_amount
        console.log(total)
        return total + vt_amount;
      },
      add_percentage_vat(){
        var returnable = 0;
        if(this.vatList.length > 0){
            for(var i = 0 ; i < this.vatList.length ; i++){
              var vt = this.vatList[i].percentage;
              var x = vt.split('%')
              returnable = Number(returnable) + Number(x[0]);
            }
        }
        this.vat_percentage = returnable+"%";
      },
      // calculate_vat_vals(finals){
      //   var vp = 0;
      //   var vat_val = 0;
      //   if(this.vatList.length > 0){
      //       for(var i = 0 ; i < this.vatList.length ; i++){
      //           var vt = this.vatList[i].percentage;
      //           var x = vt.split('%')
      //           vat_val += Number(finals)*(Number(x[0])/100)
      //           vp = Number(vp) + Number(x[0])
      //       }
      //   }
      //   this.vat_percentage = vp + "%";
      //   return vat_val;
      // },
      async barcode_add(){
        if(this.barcode == ''){
          this.error = "Please enter value before!"
          this.snackbar = true;
        }else{
          var its;
          if(this.barcode.charAt(0) == "#"){
            var s = this.barcode.split('#')
            its = await ItemService.getItemByID(s[1]);
            if(its.length == 0 ){
              this.error = "No Item ID s found";
              this.snackbar = true;
            }else{
              this.add_item(its[0]);
            }
          }else{
            its = await ItemService.getItemByCode(this.barcode);
            if(its.length == 0){
              this.error = "No Item Codes found";
              this.snackbar = true;
            }else{
              this.add_item(its[0]);
            }
          }
          this.barcode = "";
        }
      },
      add_me(item){
        this.add_item(item);
        this.additemdialog = false
      },
      add_item(item){
        var not_exists = true;
        for(var i = 0 ; i < this.addedItems.length ; i++){
          if(this.addedItems[i].item == item.id){
            not_exists = false;
          }
        }
        if(not_exists){
          var mdl = {
            item:item.id,
            code:item.code,
            itemname:item.name,
            qty:0,
            up:item.price,
            total:0,
            disc:'',
            final:0
          }
          this.addedItems = this.addedItems.concat(mdl);
        }else{
          this.error = "Item Alrerady Added!";
          this.snackbar = true;
        }
      },
      calculate_total(){
        this.total = 0
        for(var i = 0 ; i < this.addedItems.length ; i++){
          this.total += this.addedItems[i].final;
        }
      },
      delete_item(item){
        for(var i = 0 ; i < this.addedItems.length ; i++){
          if(this.addedItems[i].item == item.item){
            this.addedItems.splice(i,1);
          }
        }
      },
      edit_item(item){
        this.itit = item.item;
        this.itqty = item.qty;
        this.itup = item.up;
        this.ittotal = item.total;
        this.itdisc = item.disc;
        this.itfinal = item.final;
        this.changeItemDialog = true;
      },
      change_item_data(){
        this.ittotal = Number(this.itup)*Number(this.itqty);
        this.itfinal = Common.discounting(this.ittotal,this.itdisc);
        for(var i = 0 ; i < this.addedItems.length ; i++){
          if(this.addedItems[i].item == this.itit){
            this.addedItems[i].qty = this.itqty;
            this.addedItems[i].up = this.itup;
            this.addedItems[i].disc = this.itdisc;
            this.addedItems[i].total = this.ittotal;
            this.addedItems[i].final = this.itfinal;
          }
        }
        this.changeItemDialog = false;
        this.calculate_total();
      },
      clear_added(){
        this.po_type = null
        this.selectedStake = []
        this.required = ''
        this.delterm = ''
        this.payterm = ''
        this.reference = ''
        this.addedItems = []
        this.itemSearch = ''
        this.remarks = ''
        this.disc = ''
      },
      show_printer_view(result){
        //need to add code
        this.poid = result;
        this.printerdi = true;
      },
      async upload_created_po(){
        if(this.addedItems.length != 0){
          if(this.po_type != ''){
             if(this.selectedStake.length > 0 ){
               var ed = new Date(this.required);
               var td = new Date();
               if(ed.getTime() >= td.getTime()){
                 this.progress = true;
                 var result = await OrderService.InsertOrder(this.selectedStake[0].id,this.required,this.total,this.disc,this.final,this.remarks,this.user,this.reference,this.delterm,this.payterm,this.po_type,this.addedItems,this.vat_percentage,this.disc_am,this.vat_am)
                 this.progress = false
                 this.clear_added();
                 //TODO:show printer View from result
                 this.show_printer_view(result.id)
               }else{
                 this.error = "Date must be today or future day!";
                 this.snackbar = true;
               }
             }else{
               this.error = "You must neet to specify your supplier!";
               this.snackbar = true;
             }
          }else{
            this.error = "Please you must need to select order type"
            this.snackbar = true;
          }
        }else{
          this.error = "Cannot Create Empty Purchase Order!"
          this.snackbar = true;
        }
      }
    },
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
    margin:1px
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