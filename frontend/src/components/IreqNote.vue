<template>
  <v-main>
    <v-container fluid ma-0 pa-0>
      <v-row>
        <v-col class="border_simplex margin_top_setup" cols="12" xs="12" sm="6" md="3" lg="3" xl="3">
          <v-text-field outlined type="date" v-model="reqdate" label="Required Date"></v-text-field>
        </v-col>
         <v-col  class="border_simplex margin_top_setup" cols="12" xs="12" sm="6" md="3" lg="3" xl="3">
           <button class="new_btn_style" style="width:100%"  @click="stakeholderdialog = true">Add Customer</button>
           <p><b>Customer Info :</b> <span  v-if="selectedStake.length > 0">
             {{selectedStake[0].name}}<br>
              {{selectedStake[0].address1}}<br>
              {{selectedStake[0].address2}}<br>
              {{selectedStake[0].address3}}<br>
              {{selectedStake[0].email}}<br>
              {{selectedStake[0].telephone}}<br>
             </span> </p>
        </v-col>
        <v-col  class="border_simplex margin_top_setup" cols="12" xs="12" sm="6" md="3" lg="3" xl="3">
         <v-text-field outlined v-model="reference" label="Reference"></v-text-field>
            <v-text-field v-model="custreference" outlined label="Customer Reference"></v-text-field>
        </v-col>
        <v-col  class="border_simplex margin_top_setup" cols="12" xs="12" sm="6" md="3" lg="3" xl="3">
           <v-card flat>
             <v-card-actions>
               <v-text-field outlined @change="calculator()"  v-model="discount" label="discount"></v-text-field>
               <v-spacer></v-spacer>
                <v-text-field outlined @change="barcodeScannner()" label="Barcode" v-model="barcode"></v-text-field>
             </v-card-actions>
             <v-card-actions>
               <p style="color:#000000">{{total.toFixed(2)}}</p>
               <v-spacer></v-spacer>
               <p style="color:#000000">{{final.toFixed(2)}}</p>
             </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col  style="padding:2rem" cols="12" sm="12" xs="12" md="9" lg="9" xl="9">
          <v-card flat>
              <v-card-actions>
                <v-card-title>Added Items</v-card-title>
                <v-spacer></v-spacer>
                <v-text-field v-model="search2" style="margin:1rem"></v-text-field>
                <v-btn  @click="addItemDialog = true" dark small fab><v-icon>mdi-plus</v-icon></v-btn>
              </v-card-actions>
              <v-data-table
              :search="search2"
              :items="addedItems"
              :headers="addeditemheader">
                <template v-slot:item.controls="{item}">
                    <v-btn small icon  @click.stop="edit_item(item)">
                    <v-icon dark>mdi-book-edit</v-icon>
                    </v-btn>
                    <v-btn small icon @click="delete_item(item)">
                      <v-icon dark>mdi-delete</v-icon>
                    </v-btn>
                </template>
              </v-data-table>
              <v-card-actions v-if="selectedItemsToEdit.length > 0">
                <v-spacer></v-spacer>
                <v-btn color="lime darken-1" @click="editSelected()" dark>Edit</v-btn>
                <v-btn color="red darken-1" @click="deleteSelected()" dark>Delete</v-btn>
              </v-card-actions>
            </v-card>
        </v-col>
        <v-col  style="padding:2rem" cols="12" sm="12" xs="12" md="3" lg="3" xl="3">
          <v-btn  @click="cleaner()" text> Clear</v-btn>&nbsp;
            <v-btn  @click="generateDocument()" dark> Generate</v-btn>
            <v-textarea v-model="remarks" label="Remarks" filled outlined style="margin:1rem"></v-textarea>
        </v-col>
      </v-row>
    </v-container>
      <v-dialog v-model="stakeholderdialog" max-width="40rem">
        <v-card style="padding:1rem">
          <v-card-actions>
            <v-card-title>Select Customer</v-card-title>
            <v-spacer></v-spacer>
            <v-text-field v-model="searchstakes"></v-text-field>
          </v-card-actions>
          <v-divider></v-divider>
          <v-data-table
          :items="stakeholder"
          :headers="stakeHeader"
          show-select
          :search="searchstakes"
          v-model="selectedStake"
          :single-select="true"
          item-key="id"></v-data-table>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="cancelnew()"  text>Cancel</v-btn>&nbsp;
            <v-btn @click="addnew()" dark>Add</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!--D: Add new Itrm Dialog -->
      <v-dialog max-width="40rem" v-model="addItemDialog">
        <v-card>
            <v-data-iterator
            :items="ItemList"
            :search="search_items_on_list">
              <template v-slot:header >
                <v-toolbar dark>
                  <v-text-field v-model="search_items_on_list" label="Search" clearable flat solo-inverted hide-details prepend-inner-icon="mdi-magnify"></v-text-field>
                  <v-spacer></v-spacer>
                  <v-btn @click="addItemDialog = false" icon>
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
                        <v-btn @click="insert_item_to_list(item)" dark>Add</v-btn>
                        <v-spacer></v-spacer>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>
              </template>
            </v-data-iterator>
        </v-card>
      </v-dialog>
      <v-dialog v-model="documentPrintDialog" max-width="60rem">
        <v-card>
          <v-toolbar dark>
            <v-toolbar-title>Item Request Note</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="documentPrintDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <IREQPrint :id="document_id"/>
        </v-card>
      </v-dialog>
      <v-dialog max-width="30rem" v-model="changeDialog">
        <v-card style="padding:1rem">
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-card-title>Change Data</v-card-title>
            <v-spacer></v-spacer>
          </v-card-actions>
          <p>{{dialogItem}}</p>
          <v-divider></v-divider>
          <v-text-field label="Quantity" v-model="dialogqty"></v-text-field>
          <v-text-field label="Unit Price" v-model="dialogup"></v-text-field>
          <v-text-field label="Discount" v-model="dialogdisc"></v-text-field>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="changeDialog = false" text>Cancel</v-btn>
            <v-btn @click="changeSelectives()" dark>Change</v-btn>
          </v-card-actions>
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
import StakeService from '../StakeService'
import ItemService from '../ItemService'
import ItemReqService from '../ItemReqService'
import Common from '../Common'
import IREQPrint from './transactions/print/IREQPrint.vue'

export default {
  components:{
    IREQPrint
  },
  data() {
    return {
      barcode:'',
      stakeholder:[],
      reqdate:"",
      search_items_on_list:"",
      reference:"",
      custreference:"",
      total:0,
      discount:"",
      final:0,
      remarks:"",
      snackbar:false,
      error:"",
      timeout:2000,
      selectedStake:[],
      search2:"",
      search3:"",
      searchstakes:"",
      stakeholderdialog:false,
      stakeHeader:[
        {
          text:"Name",
          value:"name"
        },{
          text:"E-mail",
          value:"email"
        },{
          text:"Telephone",
          value:"telephone"
        }
      ],
      allItems:[],
      addItemDialog:false,
      addeditemheader:[
        {
          text:"",
          value:"controls"
        },
        {
          text:"Name",
          value:"itemname"
        },{
          text:"Unit Price",
          value:"unitprice"
        },{
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
      selectedItemFromList:[],
      addedItems:[],
      selectedItemsToEdit:[],
      changeDialog:false,
      dialogItem:"",
      dialogqty:0,
      dialogup:0,
      dialogdisc:"",
      user:"",
      selected_item_code:0,
      categories:[],
      types:[],
      document_id:null,
      ItemList:[],
      documentPrintDialog:false,
    }
  },
  methods: {
    cancelnew(){
      this.selectedStake = []
      this.stakeholderdialog = false
    },
    addnew(){
      if(this.selectedStake.length > 0){
        this.stakeholderdialog = false
      }else{
        this.error = "Please select one of stakeholder"
        this.snackbar = true
      }
    },
    async generateDocument(){
      var res = await ItemReqService.InsertItemRequest(this.reqdate,this.selectedStake[0].id,this.reference,this.custreference,this.total.toFixed(2),this.discount,this.final.toFixed(2),this.remarks,this.user,Date.now());
      var documentio = res[0].insertId
      for(var i = 0 ; i < this.addedItems.length ; i++){
        await ItemReqService.InsertRequestItem(this.addedItems[i].item,documentio,this.addedItems[i].unitprice,this.addedItems[i].quantity,this.addedItems[i].total.toFixed(2),this.addedItems[i].discount,this.addedItems[i].final.toFixed(2))
      }
      this.document_id = documentio;
      this.documentPrintDialog = true;
      this.cleaner()
    },
    cancel_new_item(){
      this.addItemDialog = false;
      this.allItems = []
      this.types = []
    },
    insert_item_to_list(itm){
      //add Items to new model
      var mdl = {
        item:itm.id,
        itemname:itm.name,
        unitprice:itm.price,
        quantity:0,
        total:0,
        discount:"",
        final:0
      }
      var already = false;
      for(var i = 0 ; i < this.addedItems.length ; i++){
        if(this.addedItems[i].item == itm.id){
          already = true;
        }
      }
      if(!already){
        this.addedItems = this.addedItems.concat(mdl)
      }else{
        this.error = "Item Already Exists on list!"
        this.snackbar = true;
      }
      
      this.addItemDialog = false
      this.allItems = []
      this.types = []
    },
    delete_item(item){
      for(var i = 0 ; i < this.addedItems.length ; i++){
        if(this.addedItems[i].item == item.item){
          this.addedItems.splice(i,1)
        }
      }
    },
    async barcodeScannner(){
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
            this.barcode_add_scannner(its[0]);
            }
        }else{
            its = await ItemService.getItemByCode(this.barcode);
            if(its.length == 0){
            this.error = "No Item Codes found";
            this.snackbar = true;
            }else{
            this.barcode_add_scannner(its[0]);
            }
        }
        this.barcode = "";
        }
    },
    barcode_add_scannner(item){
          var mdl = {
            item:item.id,
            itemname:item.name,
            unitprice:item.price,
            quantity:0,
            total:0,
            discount:item.discount,
            final:0
          }
          this.addedItems = this.addedItems.concat(mdl)
    },
    edit_item(item){
        for(var i = 0 ; i < this.addedItems.length ; i++){
          if(this.addedItems[i].item == item.item){
            //do sctions
            this.selected_item_code = item.item
            this.dialogItem = item.itemname
            this.dialogqty = item.quantity
            this.dialogup = item.unitprice
            this.dialogdisc = item.discount
            this.changeDialog = true;
            break;
          }else{
            continue;
          }
      }
    },
    changeSelectives(){
      for(var i = 0 ; i < this.addedItems.length ; i++){
          if(this.addedItems[i].item == this.selected_item_code){
            this.addedItems[i].quantity = this.dialogqty
            this.addedItems[i].unitprice = this.dialogup
            this.addedItems[i].total = this.addedItems[i].quantity*this.addedItems[i].unitprice
            this.addedItems[i].discount = this.dialogdisc
            this.addedItems[i].final = Common.discounting(this.addedItems[i].total,this.addedItems[i].discount);
            this.calculator()
            this.changeDialog = false;
          }else{
            continue;
          }
        }
    },
    calculator(){
      //total
      this.total = 0
      for(var i = 0 ; i < this.addedItems.length ; i++){
        this.total += this.addedItems[i].final
      }
      //discount
      this.final = Common.discounting(this.total,this.discount)
      //finalize
    },
    cleaner(){
      this.addedItems = []
      this.reference = ""
      this.custreference = ""
      this.discount = ""
      this.reqdate = ""
      this.selectedStake = []
      this.calculator()
    },
    async view_types(catid){
      this.types = await ItemService.GetTypes(catid)
    },
    async getAllItemsList(id){
      this.allItems = await ItemService.GetItemsByType(id);
    }
  },

  async created() {
    this.stakeholder = await StakeService.GetAllStakes('Customer');
    //this.categories = await ItemService.GetAllCategories()
    this.ItemList =await ItemService.GetAllAvailableItems()
    this.user = localStorage.getItem('UserToken');
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