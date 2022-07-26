<template>
  <v-main>
      <v-container fluid ma-0 pa-0 class="margin_top_setup">
          <v-row >
              <!--Type Selector-->
              <v-col sm="6" xs="6" md="2" class="border_simplex">
                  <Type v-model="invoice_type"/>
              </v-col>
              <!--Add Item-->
              <v-col sm="6" xs="6" md="2" class="border_simplex">
                  <v-text-field label="Request" v-model="item_req_no"></v-text-field>
                  <button @click="add_item_request()" class="new_btn_style">Add</button>
                  <button @click="add_cust = true" class="new_btn_style">Customer</button>
                  <div>
                      <b>Order</b> :<span v-if="itemRequest != null">{{itemRequest.id}}</span><br/>
                      <b>customer</b> : <span v-if="selected_cust.length > 0">{{selected_cust[0].name}}</span>
                      <span v-if="itemRequest != null">{{itemRequest.name}}</span>
                  </div>
              </v-col>
              <!-- Transactions -->
              <v-col sm="12" xs="12" md="5" class="border_simplex">
                  <v-card flat>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-chip label dark class="dark_color">Cash : {{cash}}</v-chip>
                        <v-spacer></v-spacer>
                        <v-chip label dark class="dark_color">Cheque : {{cheque}}</v-chip>
                        <v-spacer></v-spacer>
                        <v-chip label dark class="dark_color">Credit : {{credit}}</v-chip>
                        <v-spacer></v-spacer>
                        <v-chip label dark class="dark_color">Bank : {{bank}}</v-chip>
                        <v-spacer></v-spacer>
                    </v-card-actions>
                    <v-card-actions>
                        <v-spacer/>
                        <v-chip v-for="(adv) in advances" :key="adv.id" label @click="remove_advance(adv)"  class="dark_color" style="margin:5px">{{adv.id}} : {{adv.use_amount}}</v-chip>
                        <v-spacer/>
                    </v-card-actions>
                    <v-card-actions>
              <v-spacer></v-spacer>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon @click="cash_dialog = true"  style="margin:3px" large v-bind="attrs" v-on="on">mdi-cash</v-icon>
                </template>
                <span>Cash</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon @click="cheque_dialog = true" style="margin:3px" large v-bind="attrs" v-on="on">mdi-text-box</v-icon>
                </template>
                <span>Cheque</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon @click="add_advance_open()"  style="margin:3px" large v-bind="attrs"  v-on="on">mdi-cash-100</v-icon>
                </template>
                <span>Advance</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon @click="credit_dialog = true"  style="margin:3px" large v-bind="attrs" v-on="on" >mdi-cash-check</v-icon>
                </template>
                <span>Credit</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon @click="bank_dialog = true"  style="margin:3px" large v-bind="attrs" v-on="on">mdi-bank</v-icon>
                </template>
                <span>bank</span>
              </v-tooltip>
              <v-spacer></v-spacer>
            </v-card-actions>
                  </v-card>
              </v-col>
              <!-- Finalize -->
              <v-col sm="12" xs="12" md="3"  class="border_simplex">
                <v-card  flat>
                    <v-card-actions>
                    <v-chip label outlined  class="dark_color">total : {{total}}</v-chip>
                    <v-spacer></v-spacer>
                    <v-chip label  class="dark_color">final : {{final}}</v-chip>
                    </v-card-actions>
                    <v-card-actions>
                    <v-text-field outlined style="margin-right:5px" v-model="discount" label="Discount"></v-text-field>
                    <v-text-field v-on:keyup.enter="add_barcode()" v-model="barcode" outlined label="Barcode"></v-text-field>
                    </v-card-actions>
                    <v-card-actions style="margin-top:0;padding-top:0">
                    <v-chip label outlined style="margin-top:0"  class="dark_color">Paid : {{paid}}</v-chip>
                    <v-spacer></v-spacer>
                    <v-chip label style="margin-top:0"  class="dark_color">Need to Pay :{{need_to_pay}}</v-chip>
                    </v-card-actions>
                </v-card>
                </v-col>
          </v-row>
          <v-row>
              <v-col cols="12" sm="12" xs="12" md="9" lg="9" xl="9">
                <v-card flat>
                    <v-card-actions>
                    <v-card-title>Added Items</v-card-title>
                    <v-spacer></v-spacer>
                    <v-text-field v-model="item_search" ></v-text-field>
                    <v-btn  dark fab small @click="add_new_item = true"  style="margin:1rem">
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                    </v-card-actions>
                    <v-divider></v-divider>
                    <v-data-table :search="item_search" :items="addedItems" :headers="addedItemHeader">
                    <template v-slot:item.controls="{item}">
                        <v-btn small icon  @click.stop="edit_item(item)">
                        <v-icon dark>mdi-book-edit</v-icon>
                        </v-btn>
                        <v-btn icon small  @click.stop="delete_item(item)">
                        <v-icon dark>mdi-delete</v-icon>
                        </v-btn>
                    </template>
                    </v-data-table>
                    <v-divider></v-divider>
                </v-card>
                </v-col>
                 <v-col cols="12" sm="12" xs="12" md="3" lg="3" xl="3">
                <v-card flat>
                    <v-progress-linear v-if="progress" color="black" indeterminate height="5" striped style="margin-left:10px;margin-right:10px"></v-progress-linear>
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn  class="dark_color"  @click="clearer()" text>Clear</v-btn>
                    <v-btn  class="dark_color"  @click="generator()" dark>Generate</v-btn>
                    </v-card-actions>
                    <v-textarea label="Remarks" v-model="remarks"  outlined></v-textarea>
                </v-card>
                </v-col>
         
          </v-row>
      </v-container>
      <!-- cash dialog -->
      <v-dialog v-model="cash_dialog" width="20rem">
          <v-card style="padding:1rem">
              <v-card-title>Add Cash</v-card-title>
              <v-text-field type="number" v-model="cash" step="0.01" label="Amount"></v-text-field>
              <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn @click="cash_dialog = false">Finish</v-btn>
              </v-card-actions>
          </v-card>
      </v-dialog>
      <v-dialog v-model="cheque_dialog" width="20rem">
          <v-card style="padding:1rem">
              <v-card-title>Add Cheque</v-card-title>
              <v-text-field v-model="cheque_id" label="Cheque ID"></v-text-field>
              <v-text-field v-model="cheque" type="number" step="0.01" label="Amount"></v-text-field>
              <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn @click="cheque_dialog = false">Finish</v-btn>
              </v-card-actions>
          </v-card>
      </v-dialog>
      <v-dialog v-model="bank_dialog" width="20rem">
          <v-card style="padding:1rem">
              <v-card-title>Add Bank</v-card-title>
              <v-text-field v-model="bank_id" label="Transaction ID"></v-text-field>
              <v-text-field v-model="bank" type="number" step="0.01" label="Amount"></v-text-field>
              <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn @click="bank_dialog = false">Finish</v-btn>
              </v-card-actions>
          </v-card>
      </v-dialog>
      <v-dialog v-model="advance_dialog" width="20rem">
          <v-card style="padding:1rem">
              <v-card-title>Add Advance</v-card-title>
              <v-select :items="all_advance_ids" label="Select Advance" v-model="selected_advance" dense></v-select>
              <p><b>Available Amount : </b><span v-if="selected_advance_all != null">{{selected_advance_all.available}}</span></p>
              <v-text-field step="0.01" type="number" v-model="taken_advance_amount" label="Taken Amount"></v-text-field>
              <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn @click="finish_advance_activity()">Finish</v-btn>
              </v-card-actions>
          </v-card>
      </v-dialog>
      <v-dialog v-model="credit_dialog" width="20rem">
          <v-card style="padding:1rem">
              <v-card-title>Add Credit</v-card-title>
              <v-text-field v-model="credit" type="number" step="0.01" label="Amount"></v-text-field>
              <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn @click="credit_dialog = false">Finish</v-btn>
              </v-card-actions>
          </v-card>
      </v-dialog>
      <!-- D:edit item dialog -->
      <v-dialog v-model="edit_item_dialog" width="20rem">
          <v-card style="padding:1rem">
              <v-card-title>Edit Item</v-card-title>
              <v-text-field v-model="itqt" label="Quantity"></v-text-field>
              <p><b>MAX Quantity :</b>{{itav}}</p>
              <v-text-field v-model="itup" label="Unit Price"></v-text-field>
              <v-text-field v-model="itdi" label="Discount"></v-text-field>
              <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn @click="edited_success()" dark>Add</v-btn>
              </v-card-actions>
          </v-card>
      </v-dialog>
      <!-- D:Add new Customer Dialog -->
      <v-dialog v-model="add_cust" width="40rem">
          <v-card style="padding:1rem">
              <v-card-actions>
                  <v-card-title>Add Customer</v-card-title>
                  <v-spacer></v-spacer>
                  <v-text-field v-model="search_cust"></v-text-field>
              </v-card-actions>
              <v-data-table v-model="selected_cust" item-key="id" show-select :single-select="true" :search="search_cust" :items="allStakes" :headers="addCustHeader"></v-data-table>
              <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn @click="add_cust = false" dark>Finish</v-btn>
              </v-card-actions>
          </v-card>
      </v-dialog>
      <!--D: Add new Itrm Dialog -->
      <v-dialog max-width="40rem" v-model="add_new_item">
        <v-card>
            <v-data-iterator
            :items="ItemList"
            :search="search_items_on_list">
              <template v-slot:header >
                <v-toolbar dark>
                  <v-text-field v-model="search_items_on_list" label="Search" clearable flat solo-inverted hide-details prepend-inner-icon="mdi-magnify"></v-text-field>
                  <v-spacer></v-spacer>
                  <v-btn @click="add_new_item = false" icon>
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
      <v-dialog v-model="printer" max-width="60rem">
          <v-card>
              <v-toolbar dark>
                  <v-toolbar-title>Invoice</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn @click="printer = false" icon>
                      <v-icon>mdi-close</v-icon>
                  </v-btn>
              </v-toolbar>
              <Final :invoice="invoice_id"/>
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
import Final from './Final.vue'
import Type from './Type.vue'
import ItemService from '../../../ItemService'
import StakeService from '../../../StakeService'
import ItemReqService from '../../../ItemReqService'
import Common from '../../../Common'
import PaymentService from '../../../PaymentService'
import InvoiceService from '../../../InvoiceService'

export default {
    components:{
        Type,Final
    },
    data() {
        return {
            invoice_id:null,
            printer:false,
            snackbar:false,
            timeout:3000,
            error:'',
            search_items_on_list:"",
            cash_dialog:false,
            cheque_dialog:false,
            advance_dialog:false,
            bank_dialog:false,
            taken_advance_amount:0,
            credit_dialog:false,
            cash:0,
            transaction_dialog:false,
            cheque:0,
            credit:0,
            paid:0,
            need_to_pay:0,
            bank:0,
            cheque_id:'',
            bank_id:'',
            user:0,
            advances:[],
            all_advances:[],
            all_advance_ids:[],
            selected_advance:'',
            selected_advance_all:null,
            total:0,
            final:0,
            discount:'',
            itid:-1,
            itav:0,
            itqt:0,
            itup:0,
            itdi:'',
            st_id:'',
            edit_item_dialog:false,
            editable_item_index:-1,
            selected_cust:[],
            add_cust:false,
            search_cust:'',
            item_search:'',
            item_req_no:'',
            add_new_item:false,
            progress:false,
            categories:[],
            allItems:[],
            types:[],
            allStakes:[],
            itemRequest:null,
            barcode:'',
            remarks:'',
            invoice_type:'',
            calculated_vats:0,
            ItemList:[],
            addedItems:[],
            addCustHeader:[{
                text:'ID',
                value:'id'
            },{
                text:'Name',
                value:'name'
            },{
                text:'E-mail',
                value:'email'
            },{
                text:'Telephone',
                value:'telephone'
            }],
            addedItemHeader:[
                {
                    text:"",
                    value:"controls"
                },
                {
                    text:"ID",
                    value:"id",
                },
                {
                    text:"Name",
                    value:"name"
                },
                {
                    text:"Quantity",
                    value:"quantity"
                },
                {
                    text:"Unit Price",
                    value:"unit_price"
                },
                {
                    text:"Discount",
                    value:"discount"
                },
                {
                    text:"Total",
                    value:"total"
                },
                {
                    text:"Final",
                    value:"final"
                }
            ],
            vatList:[],
        }
    },
    watch:{
        'selected_advance':function(){
            for(var i = 0 ; i < this.all_advances.length ; i++){
                if(this.selected_advance == this.all_advances[i].id){
                    this.selected_advance_all = this.all_advances[i];
                }
            }
        },
        'invoice_type':async function(){
            this.vatList = await InvoiceService.GETAllRelatedVats(this.invoice_type);
            this.calculate_discount();
        },
        'addedItems':function(){
            this.calculate_total();
        },
        'total':function(){
            this.calculate_discount();
        },
        'discount':function(){
            this.calculate_discount();
        },
        'cash':function(){
            this.calculate_paid_amount();
        },
        'cheque':function(){
            this.calculate_paid_amount();
        },
        'bank':function(){
            this.calculate_paid_amount();
        },
        'credit':function(){
            this.calculate_paid_amount();
        },
        'advances':function(){
            this.calculate_paid_amount();
        },
        'paid':function(){
            this.calculate_need_to_pay();
        },
        'final':function(){
            this.calculate_need_to_pay()
        }

    },
    async created() {
        //this.categories = await ItemService.GETCategoriesWithNumType();
        this.ItemList =await ItemService.GetAllAvailableItems()
        this.allStakes = await StakeService.GetAllStakes('Customer');
        this.user = localStorage.getItem('UserToken');
    },
    methods: {
        calculate_paid_amount(){
            var pai = 0;
            for(var i = 0 ; i < this.advances.length ; i++){
                pai += Number(this.advances[i].use_amount)
            }
            pai += Number(this.cash);
            pai += Number(this.cheque);
            pai += Number(this.bank);
            pai += Number(this.credit);

            this.paid = pai;
        },
        calculate_need_to_pay(){
            this.need_to_pay = Number(this.final) - Number(this.paid)
        },
        finish_advance_activity(){
            if(Number(this.selected_advance_all.available) >= Number(this.taken_advance_amount)){
                var ad = {
                    id:this.selected_advance_all.id,
                    use_amount:this.taken_advance_amount
                }
                this.advances = this.advances.concat(ad);
            }else{
                this.error = "Taken Amount is Exceed Available Amount!";
                this.snackbar = true;
            }
            this.advance_dialog = false;
        },
        edited_success(){
            for(var i = 0 ; i < this.addedItems.length ; i++){
                if(this.addedItems[i].id == this.itid){
                    if(this.itav >= this.itqt){
                        this.addedItems[i].quantity = this.itqt;
                        this.addedItems[i].unit_price = this.itup;
                        this.addedItems[i].discount = this.itdi;
                        this.addedItems[i].total = Number(this.itqt) * Number(this.itup)
                        this.addedItems[i].final = Common.discounting(this.addedItems[i].total,this.itdi);
                        this.edit_item_dialog = false;
                        this.calculate_total();
                    }
                }
            }
        },
        setup_advances(){
            for(var i = 0 ; i < this.all_advances.length ; i++){
                this.all_advance_ids = this.all_advance_ids.concat(this.all_advances[i].id);
                this.advance_dialog = true;
            }
        },
        async add_advance_open(){
            this.progress = true;
            var s;
            if(this.selected_cust.length > 0){
                s = this.selected_cust[0].id; 
                this.all_advances =await PaymentService.GetAdvancesByStake(s)
                this.setup_advances();
            }else if(this.itemRequest != null){
                s = this.itemRequest.customer;
                this.all_advances =await PaymentService.GetAdvancesByStake(s)
                this.setup_advances()
            }else{
                this.error = "You must need to add customer or add item request before advances!";
            }
            this.progress = false;
            
        },
        calculate_discount(){
            this.final = Common.discounting(this.total,this.discount);
            this.final += this.calculate_vats(this.final);
        },
        calculate_vats(finals){
            var vat_val = 0;
            if(this.vatList.length > 0){
                for(var i = 0 ; i < this.vatList.length ; i++){
                    var vt = this.vatList[i].percentage;
                    var x = vt.split('%')
                    vat_val += Number(finals)*(Number(x[0])/100)
                }
            }
            return vat_val;
        },
        calculate_total(){
            this.total = 0;
            for(var i = 0 ; i < this.addedItems.length ; i++){
                this.total += this.addedItems[i].final
            }
        },
        remove_advance(adv){
            //remove advance
            for(var i = 0 ; i < this.advances.length ; i++){
                if(this.advances[i].id == adv.id){
                    this.advances.splice(i,1)
                }
            }
        },
        async generator(){
            //generate Invoice
            this.progress = true;
            if(Number(this.need_to_pay) < 1 && this.addedItems.length > 0 && this.invoice_type != ''){
                if(this.selected_cust.length > 0){
                    this.st_id = this.selected_cust[0].id;
                }else if(this.itemRequest != null){
                    this.st_id = this.itemRequest.customer;
                }
                var invData = await InvoiceService.CreateInvoice(this.invoice_type,this.st_id,this.itemRequest,this.total,this.discount,this.final,this.cash,this.credit,this.cheque,this.cheque_id,this.bank,this.bank_id,this.advances,this.addedItems,this.remarks,this.user,this.paid);
                this.invoice_id = invData[0].insertId;
                this.printer = true;
                this.clearer();
            }else if(Number(this.need_to_pay) >= 1){
                this.error = "Please Complete Payments Before process"
                this.snackbar = true;
            }else if(this.addedItems.length == 0){
                this.error = "you must need to insert at least one item"
                this.snackbar = true;
            }else{
                this.error = "Select Preferred Invoice Type";
                this.snackbar = true;
            }
            this.progress = false;
            
        },
        edit_item(item){
            this.itid = item.id;
            this.itqt = item.quantity;
            this.itup = item.unit_price;
            this.itdi = item.discount;
            this.itav = item.available;
            this.edit_item_dialog = true;
        },
        delete_item(item){
            for(var i = 0 ; i < this.addedItems.length ; i++){
                if(this.addedItems[i].id == item.id){
                    this.addedItems.splice(i,1)
                }
            }
        },
        async view_types(category_id){
            this.types = await ItemService.typesofcategory(category_id);
        },
        async view_item_by_type(id){
            this.allItems = await ItemService.ItemFromType(id);
        },
        add_item_to_list(item){
            if(!this.search_on_added(item.id)){
                var its = {
                    id:item.id,
                    name:item.name,
                    available:item.quantity,
                    quantity:0,
                    unit_price:item.price,
                    total:0,
                    discount:0,
                    final:0
                }
                this.addedItems = this.addedItems.concat(its)
                this.allItems.length = 0;
                this.types.length = 0
            }else{
                this.allItems.length = 0;
                this.types.length = 0
                this.error = "Item Already Exists in this item list";
                this.snackbar = true;
            }
            
        },
        search_on_added(id){
            for(var i = 0 ; i < this.addedItems.length ; i++){
                if(this.addedItems[i].id == id){
                    return true;
                }
            }
            return false;
        },
        cancel_new_item(){
            this.allItems.length = 0;
            this.types.length = 0
            this.add_new_item = false;
        },
        async add_barcode(){
            this.progress = true;
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
                this.add_item_to_list(its[0]);
                }
            }else{
                its = await ItemService.getItemByCode(this.barcode);
                if(its.length == 0){
                this.error = "No Item Codes found";
                this.snackbar = true;
                }else{
                this.add_item_to_list(its[0]);
                }
            }
            this.barcode = "";
            }
            this.progress = false;
        },
        async add_item_request(){
            this.progress = true;
            if(this.addedItems.length == 0){
                var ir = await ItemReqService.getAllDataOfDocument(this.item_req_no);
                this.itemRequest = ir[0]
                var re = await ItemReqService.getAllItemsInRequest(this.item_req_no);
                this.addedItems = re;
            }else{
                this.error = "This invoice has already Items.please inseert Item Request Very Firstly!";
                this.snackbar = true;
            }
            this.progress = false;
        },
        clearer(){
            this.itemRequest = null;
            this.addedItems = [];
            this.cash = 0;
            this.credit = 0;
            this.bank = 0;
            this.cheque = 0;
            this.advances = [];
            this.cheque_id = '';
            this.bank_id = '';
            this.selected_cust = [];
            this.remarks = '';
        },
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