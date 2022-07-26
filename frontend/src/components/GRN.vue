<template>
  <v-main>
    <v-container fluid ma-0 pa-0>
      <v-row class="margin_top_setup">
        <v-col  cols="6" sm="6" xs="6" md="2" lg="2"  class="border_simplex">
          <Type v-model="grn_type" />
        </v-col>
        <v-col cols="6" sm="6" xs="6" md="3" lg="3" class="border_simplex">
          <div style="display:flex;justify-content:space-between">
             <button  @click="AddPODialog = true" class="new_btn_style" >Add PO</button>
            <button class="new_btn_style" @click="stake_selector = true">Add Supplier</button>
          </div>
          <v-text-field outlined label="Received Date" v-model="rdate" type="date"></v-text-field>
          <p><b>Order No : <span v-if="selectedpo != null">{{selectedpo.id}}</span></b></p>
          <p><b>Supplier : </b><span v-if="addedStake != null">{{addedStake.name}}</span></p>
                    
        </v-col>
        <v-col cols="6" sm="6" xs="6" md="3" lg="3" class="border_simplex">
          <v-text-field outlined v-model="invoice" label="Invoice"></v-text-field>
          <v-text-field outlined v-model="reference_grn" label="Reference"></v-text-field>
          <v-text-field v-model="barcode" v-on:keyup.enter="barcodeSelector()" label="Barcode"></v-text-field>
        </v-col>
        <v-col cols="6" sm="6" xs="6" md="4" lg="4" class="border_simplex">
          <v-card flat>
            <v-card-actions>
              <v-chip label>Total : {{total.toFixed(2)}}</v-chip>
              <v-spacer></v-spacer>
              <v-chip label>Final : {{final.toFixed(2)}}</v-chip>
            </v-card-actions>
            <v-card-actions>
              <v-text-field label="VAT Percentage" v-model="vat_percentage" ></v-text-field>
              <v-spacer></v-spacer>
              <v-text-field label="Discount" v-model="discount"></v-text-field>
            </v-card-actions>
            <v-text-field outlined v-model="payment_term" label="Payment Term"></v-text-field>
          </v-card>   
        </v-col>
      </v-row>
      <v-row>
        <v-col  cols="12" sm="12" xs="12" md="9" lg="9">
           <v-card flat style="padding:1rem">
         <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn fab small @click="showSelectItem()" dark>
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-card-actions>
        <v-data-table
        :items="grnItemList"
        item-key="item._id"
        :headers="grnItemListHeader">
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
        <v-col cols="12" sm="12" xs="12" md="3" lg="3">
          <v-card flat>
             <v-progress-linear
                indeterminate
                color="black"
                style="margin:5px"
                v-if="progress"
              ></v-progress-linear>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="clear()" text>Clear</v-btn>&nbsp;
              <v-btn @click="generator()" dark>Generate</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
            <v-textarea outlined v-model="remarks" label="Remarks"></v-textarea>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
      
      <v-dialog v-model="AddPODialog" max-width="40rem">
        <v-card>
          <v-card-actions>
            <v-card-title>Add Purchase Order</v-card-title>
            <v-spacer></v-spacer>
            <v-text-field v-model="posearch"></v-text-field>
          </v-card-actions>
          <v-data-table
          :items="PendingOrders"
          :headers="POHead"
          :search="posearch"
          item-key="id">
          <template v-slot:item.controls="{item}">
                        <v-btn small icon  @click.stop="select_Purchase_Order(item)">
                        <v-icon dark>mdi-plus-circle</v-icon>
                        </v-btn>
                    </template>
          </v-data-table>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="AddPODialog = false" text>Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog max-width="40rem" v-model="ItemSelectorDialog">
        <v-card>
            <v-data-iterator
            :items="allItemsGot"
            :search="search_items_on_list">
              <template v-slot:header >
                <v-toolbar dark>
                  <v-text-field v-model="search_items_on_list" label="Search" clearable flat solo-inverted hide-details prepend-inner-icon="mdi-magnify"></v-text-field>
                  <v-spacer></v-spacer>
                  <v-btn @click="ItemSelectorDialog = false" icon>
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
                        <v-btn @click="add_item_to_list(item)" dark>Add</v-btn>
                        <v-spacer></v-spacer>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>
              </template>
            </v-data-iterator>
        </v-card>
      </v-dialog>
      <v-dialog v-model="askDialog" max-width="15rem">
        <v-card style="padding:1rem">
          Do You Wish to process GRN Without PO
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" @click="noans()" text >No</v-btn>
            <v-btn color="green darken-1" @click="yesans()" text>Yes</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog max-width="15rem" v-model="changeDialog">
        <v-card style="padding:1rem">
          <v-card-title>Change Item</v-card-title>
          <v-divider></v-divider>
          <v-text-field v-model="itqty" label="Quantity"></v-text-field>
          <v-text-field v-model="itup" label="Unit Price"></v-text-field>
          <v-text-field  v-model="itdis" label="Discount"></v-text-field>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="added()" dark>Add</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog max-width="70rem" v-model="stake_selector">
        <v-card style="padding:1rem">
          <v-card-actions>
            <v-card-title>Select Supplier</v-card-title>
            <v-spacer></v-spacer>
            <v-text-field v-model="stake_search" label="Search Here...."></v-text-field>
          </v-card-actions>
          <v-data-table
          :items="allStakeholders"
          :headers="stake_headers"
          >
          <template v-slot:item.controls="{item}">
                        <v-btn small icon  @click.stop="select_stakeholder(item)">
                        <v-icon dark>mdi-plus-circle</v-icon>
                        </v-btn>
                    </template>
          </v-data-table>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="stake_selector = false" text>Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="gpDialog">
        <v-card flat>
          <v-toolbar dark>
            <v-toolbar-title>Print GRN</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn @click="gpDialog = false" icon>
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <GRNPrint :id="gpid"/>
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
import DocumentService from '../Document'
import OrderService from '../OrderService'
import ItemService from '../ItemService'
import Common from '../Common'
import StakeService from '../StakeService'
import GRNPrint from '../components/transactions/print/GRNPrint.vue'
import Type from './transactions/invoice/Type.vue'

export default {
    name:"GRN",
    components:{
      GRNPrint,
      Type
    },
    data() {
      return {
        categories:[],
        progress:false,
        snackbar:false,
        timeout:2000,
        payment_term:'',
        error:"",
        search_items_on_list:'',
        PendingOrders:[],
        reference_grn:'',
        vat_percentage:'',
        discount:'',
        AddPODialog:false,
        posearch:"",
        remarks:"",
        POHead:[
          {
            text:"",
            value:"controls"
          },
          {
            text:"Supplier",
            value:"name"
          },
          {
            text:"Required Date",
            value:"required"
          },{
            text:"Requested Date",
            value:"requested"
          },{
            text:"Total",
            value:"total"
          },{
            text:"Final",
            value:"final"
          }
        ],
        selectedpo:null,
        ItemList:[],
        ItemSearch:"",
        ItemSelectorDialog:false,
        selectedIT:[],
        grnItemList:[],
        grnItemListHeader:[
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
            value:"name"
          },{
            text:"Quantity",
            value:"newquantity"
          },{
            text:"Unit Price",
            value:"unitprice"
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
        itqty:"",
        user:"",
        itup:"",
        itdis:"",
        askDialog:false,
        answer:false,
        itfin:"",
        rdate:"",
        grn_type:'',
        previous_vat:0,
        invoice:"",
        changeDialog:false,
        total:0,
        barcode:'',
        allStakeholders:[],
        stake_selector:false,
        final:0,
        stake_search:'',
        addedStake:null,
        stake_headers:[
          {
            text:"",
            value:"controls"
          },
          {
            text:"Name",
            value:"name"
          },
          {
            text:"Address Line 1",
            value:"address1"
          },
          {
            text:"Address Line 2",
            value:"address2"
          },
          {
            text:"Address Line 3",
            value:"address3"
          },
          {
            text:"E-mail",
            value:"email"
          },{
            text:"Telephone",
            value:"telephone"
          }
        ],
        edit_item_code:'',
        types:[],
        allItems:[],
        gpDialog:false,
        vat_am:0,
        disc_am:0,
        gpid:-1,
        allItemsGot:[],
      }
    },
    watch:{
      'grnItemList':function(){
        this.totalCalc();
      },
      'grn_type':function(){
        this.calculateVat();
      },
      'total':function(){
        this.calculate_final_amount();
      },
      'discount':function(){
        this.calculate_final_amount();
      },
      'vat_percentage':function(){
        this.calculate_final_amount();
      }
    },
    async created() {
      this.PendingOrders = await OrderService.GETPendingOrders();
      this.user = localStorage.getItem('UserToken');
      this.ItemList =await ItemService.GetAllAvailableItems()
      this.allStakeholders = await StakeService.GetAllStakes("Suppliers");
      this.allItemsGot = await ItemService.GetAllAvailableItems()
    },
    methods: {
      calculate_final_amount(){
        this.final = Common.discounting(this.total,this.discount)
        this.disc_am = Number(this.final) - Number(this.total)
        this.calculate_vat();
      },
      calculate_vat(){
        var vt = this.vat_percentage;
        var vtt = vt.split('%');
        var vat = Number(this.final)*(Number(vtt[0])/100)
        this.vat_am = vat;
        this.final = Number(this.final) + Number(this.vat_am);
      },
      select_stakeholder(item){
        this.addedStake = item;
        this.stake_selector = false;
      },
      edit_items(item){
        this.changeDialog = true;
        this.edit_item_code = item.code;
        this.itqty = item.newquantity
        this.itup = item.unitprice
        this.itdis = item.discount
      },
      added(){
        for(var i = 0 ; i < this.grnItemList.length ; i++){
          if(this.grnItemList[i].code == this.edit_item_code){
            if(this.grnItemList[i].quantitiy >= 0){
              if(this.itqty <= this.grnItemList[i].quantitiy - this.grnItemList[i].success){
                this.grnItemList[i].newquantity = this.itqty;
                this.grnItemList[i].unitprice = this.itup;
                this.grnItemList[i].discount = this.itdis;
                this.grnItemList[i].total = Number(this.grnItemList[i].newquantity)*Number(this.grnItemList[i].unitprice);
                this.grnItemList[i].final = Common.discounting(this.grnItemList[i].total,this.grnItemList[i].discount);
              }else{
                this.error = "Cannot Exceed Pending Value"
                this.snackbar = true;
              }
            }else{
              this.grnItemList[i].newquantity = this.itqty;
              this.grnItemList[i].unitprice = this.itup;
              this.grnItemList[i].discount = this.itdis;
              this.grnItemList[i].total = Number(this.grnItemList[i].newquantity)*Number(this.grnItemList[i].unitprice);
              this.grnItemList[i].final = Common.discounting(this.grnItemList[i].total,this.grnItemList[i].discount);
            }
          }
        }
        this.totalCalc();
        this.changeDialog = false;
      },
      delete_items(item){
        for(var i = 0 ; i < this.grnItemList.length ; i++){
          if(this.grnItemList[i].code == item.code){
            this.grnItemList.splice(i,1);
          }
        }
      },
      ///matchiong to modern
      async select_Purchase_Order(item){
        if(this.grnItemList.length == 0){
          var stakemodel = {
            id:item.st_id,
            name:item.name,
            address1:item.address1,
            address2:item.address2,
            address3:item.address3,
            email:item.email,
            telephone:item.telephone
          }
          if(this.addedStake != null){
            this.error = "Supplier Will Automatically Change to added Supplier"
            this.snackbar = true;
          }
          this.addedStake = stakemodel;
          var git = await OrderService.GETOrderItems(item.id);
          for(var i = 0 ; i < git.length ; i++){
            git[i].newquantity = Number(git[i].quantitiy) - Number(git[i].success);
            git[i].total = Number(git[i].newquantity) * Number(git[i].unitprice);
            git[i].final = Common.discounting(git[i].total,git[i].discount)
          }
          this.grnItemList = git;
          this.totalCalc();
          this.selectedpo = item
          this.grn_type = item.type
          this.vat_percentage = item.vat_percentage
          this.discount = item.discount
          this.total = item.total;
        }else{
          this.error = "Items Already Added Without PO";
          this.snackbar = true;
        }
        this.AddPODialog = false;
      },
      totalCalc(){
        var ttl = 0
        for(var i = 0 ; i < this.grnItemList.length ; i++){
          ttl += this.grnItemList[i].final
        }
        this.total = ttl
        this.calculateVat();
      },
      async calculateVat(){
        if(this.grn_type != ''){
          var vats = await DocumentService.GetCalculatedVats(this.grn_type)
          var vam = 0;
          for(var j = 0 ; j < vats.length ; j++){
            var vs = vats[j].percentage.split('%');
            var amount = vs[0];
            var vp = Number(amount)/100;
            vam += vp*this.total;
          }
          // if(Number(this.previous_vat) > 0){
          //   this.additional = Number(this.additional) + Number(vam) - Number(this.previous_vat);
          // }else{
          //   this.additional = Number(this.additional) + Number(vam);
          // }
          this.previous_vat = Number(vam)
          
        }
      },
      async showSelectItem(){
        if(this.selectedpo != null){
          this.error = "All Items Already Added From PO, you can do changes"
          this.snackbar = true;
        }else{
          this.askDialog = true;
        }
      },
      noans(){
        this.answer = false;
        this.askDialog = false;
        this.error = "if you process with PO, Please Add PO before Items"
        this.snackbar = true;
        this.AddPODialog = true;
      },
      async yesans(){
        this.answer = true;
        this.askDialog = false;
        this.ItemSelectorDialog = true;
        this.categories =await ItemService.GETCategoriesWithNumType();
      },
      add_item_to_list(itm){
        var mdl = {
          item:itm.id,
          code:itm.code,
          name:itm.name,
          newquantity:0,
          quantity:-1,
          unitprice:itm.price,
          total:0,
          discount:'',
          final:0,
        }
        var res = false;
        for(var i = 0 ; i < this.grnItemList.length ; i++){
          if(this.grnItemList[i].item == mdl.item){
            res = true;
          }
        }
        if(res){
          this.error = "Item Already Exists";
          this.snackbar = true;
        }else{
          this.grnItemList = this.grnItemList.concat(mdl)
        }
        this.allItems = []
        this.types = []
      },
      async barcodeSelector(){
        if(this.selectedpo == null){
          if(this.barcode.length > 0){
            var its
            if(this.barcode.charAt(0) == '#'){
              //find id
              var s = this.barcode.split('#')
              its = await ItemService.getItemByID(s[1]);
              if(its.length == 0 ){
                this.error = "No Item ID s found";
                this.snackbar = true;
              }else{
                this.add_item_to_list(its[0]);
              }
            }else{
              //find code
              its = await ItemService.getItemByCode(this.barcode);
              if(its.length == 0){
                this.error = "No Item Codes found";
                this.snackbar = true;
              }else{
                this.add_item_to_list(its[0]);
              }
            }
          }else{
            this.error = "Please Enter Valid Barcode";
            this.snackbar = true;
          }
        }else{
          this.error = "You cannot Add Item That not in PO";
          this.snackbar = true;
        }
        this.barcode = "";
      },
      async generator(){
        this.progress = true;
        var poid;
        if(this.selectedpo != null){
          poid = this.selectedpo.id
        }else{
          poid = null
        }
        var stid
        if(this.addedStake == null){
          stid = null
        }else{
          stid = this.addedStake.id;
        }
        var itms = [];
        for(var i = 0 ; i < this.grnItemList.length ; i++){
          var model = {
            id:this.grnItemList[i].item,
            quantity:this.grnItemList[i].newquantity,
            unitprice:this.grnItemList[i].unitprice,
            discount:this.grnItemList[i].discount,
            total:this.grnItemList[i].total,
            final:this.grnItemList[i].final
          }
          itms = itms.concat(model);
        }
        if(this.grnItemList.length > 0 && this.invoice != '' && this.rdate != ''){
          var result = await DocumentService.InsertDoc(this.rdate,this.invoice,this.reference_grn,this.payment_term,poid,stid,this.total,this.remarks,this.user,this.vat_percentage,this.discount,this.vat_am,this.disc_am,this.final,itms)
          this.gpid = result.insertId
          this.gpDialog = true;
          this.clear();
        }else if(this.rdate == ''){
          this.error = "Please Insert Received Date!"
          this.snackbar = true;
        }else if(this.invoice == ''){
          this.error = "You Must Need to Insert Invoice Number!"
          this.snackbar = true;
        }else{
          this.error = "Please Insert One Item at least!"
          this.snackbar = true;
        }
        this.progress = false
      },
      clear(){
        this.grnItemList = []
        this.rdate = ''
        this.invoice = ''
        this.reference_grn = ''
        this.payment_term = ''
        this.selectedpo = null
        this.addedStake = null
        this.remarks = ''
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