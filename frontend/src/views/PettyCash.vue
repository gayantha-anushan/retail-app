<template>
  <v-app>
      <v-main>
          <v-toolbar dark>
              <v-btn icon to="/dashboard">
                  <v-icon>mdi-home</v-icon>
              </v-btn>
              <v-toolbar-title>Petty Cash Book</v-toolbar-title>
                                <v-spacer></v-spacer>
                  <v-text-field v-model="search_field" ></v-text-field>
                  <v-btn @click="setoff_dialog = true" style="margin-left:10px" text>Set Off</v-btn>
                  <v-btn @click="expense_dialog = true" dark>Expense</v-btn>
                  <v-btn @click="print_dialog = true" dark>Print</v-btn>
          </v-toolbar>
          <v-card flat>
              <v-data-table
              :search="search_field"
              :headers="pettyCashHeaders"
              :items="petty_transactions"
              ></v-data-table>
          </v-card>
          <v-dialog v-model="setoff_dialog" max-width="30rem">
              <v-card style="padding:1rem">
                  <v-card-title>Set Off</v-card-title>
                  <v-select v-model="setoff_account" :items="all_accounts" item-text="name" label="Account"></v-select>
                  <v-text-field v-model="setoff_reason" label="Reason"></v-text-field>
                  <v-text-field v-model="setoff_amount" label="Amount" type="Number" step="0.01"></v-text-field>
                  <v-text-field v-model="setoff_remarks" label="Remarks"></v-text-field>
                  <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn @click="setoff_dialog = false" text>Cancel</v-btn>
                      <v-btn @click="complete_setoff()" dark>Add</v-btn>
                  </v-card-actions>
              </v-card>
          </v-dialog>
          <v-dialog max-width="30rem" v-model="expense_dialog">
              <v-card style="padding:1rem">
                  <v-card-title>Expense</v-card-title>
                  <v-select label="Account" :items="all_accounts" item-text="name" v-model="expense_account"></v-select>
                  <v-select label="Type" :items="expense_types" item-text="name" v-model="expensed_type"></v-select>
                  <v-text-field v-model="expense_reason" label="Reason"></v-text-field>
                  <v-text-field v-model="expense_amount" label="Amount" type="Number" step="0.01"></v-text-field>
                  <v-textarea outlined label="Remarks" v-model="remarks_expense"></v-textarea>
                  <v-switch inset label="Settled Already" v-model="expense_settled"></v-switch>
                  <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn @click="expense_dialog = false" text>Cancel</v-btn>
                      <v-btn @click="complete_expense()" dark>Expense</v-btn>
                  </v-card-actions>
              </v-card>
          </v-dialog>
          <v-dialog v-model="print_dialog" max-width="20rem">
              <v-card style="padding:1rem">
                  <v-card-title>Print</v-card-title>
                  <v-select :items="printable_acc" item-text="name" item-value="id" v-model="print_acc"></v-select>
                  <v-select :items="print_type" item-text="name" item-value="id" v-model="print_type_name"></v-select>
                  <v-select :items="settle_options" v-model="print_settle"></v-select>
                  <v-select :items="transaction_options" v-model="print_transaction"></v-select>
                  <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn dark @click="print_transaction_data()">
                          Print
                      </v-btn>
                      <v-spacer></v-spacer>
                  </v-card-actions>
              </v-card>
          </v-dialog>
          <v-dialog fullscreen v-model="documentation_dialog">
              <v-card>
                  <v-toolbar dark>
                    <v-toolbar-title>Print Document</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn @click="documentation_dialog = false" icon>
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-toolbar>
                  <PettyPrint :items="print_data_list" />
              </v-card>
          </v-dialog>
      </v-main>
  </v-app>
</template>

<script>
import PettyService from '../PettyService'
import PettyPrint from '../components/transactions/print/PettyPrint.vue'

export default {
    name:"PettyCash",
    components:{
        PettyPrint,
    },
    data(){
        return {
            search_field:"",
            documentation_dialog:false,
            setoff_account:"",
            settle_options:["Settled","Not Settled","Both"],
            transaction_options:["Expense","Settlements","Both"],
            print_acc:null,
            print_dialog:false,
            setoff_reason:"",
            setoff_amount:"",
            setoff_remarks:"",
            setoff_dialog:false,
            expense_dialog:false,
            all_accounts:[],
            expense_account:"",
            pettyCashHeaders:[
                {
                    text:"ID",
                    value:"id"
                },{
                    text:"Transaction",
                    value:"transaction_type"
                },{
                    text:"Account",
                    value:"account_name"
                },{
                    text:"Type",
                    value:"type_name"
                },{
                    text:"Reason",
                    value:"reason"
                },{
                    text:"Amount",
                    value:"amount"
                },{
                    text:"Settle",
                    value:"settle"
                }
            ],
            petty_transactions:[],
            expense_types:[],
            expensed_type:null,
            expense_reason:'',
            expense_amount:0,
            remarks_expense:'',
            expense_settled:false,
            print_type:[],
            print_type_name:null,
            print_settle:null,
            print_transaction:null,
            printable_acc:[],
            print_data_list:[],
        }
    },
    watch:{
        "expense_account":async function(){
            var selected_account = null
            for(var i = 0 ; i < this.all_accounts.length ; i++){
                if(this.all_accounts[i].name == this.expense_account){
                    selected_account = this.all_accounts[i].id;
                }
            }
            if(selected_account != null){
                this.expense_types = await PettyService.GetTypeByAccount(selected_account);
            }
        },
        "print_dialog":function(){
            var x = {
                id:0,
                name:"ALL"
            }
            this.printable_acc = this.all_accounts
            this.printable_acc = this.printable_acc.concat(x);
        },
        "print_acc":async function(){
            var selected_account = this.print_acc
            if(selected_account != null){
                this.print_type = await PettyService.GetTypeByAccount(selected_account);
                this.print_type = this.print_type.concat({
                    id:0,
                    name:"ALL"
                })
            }
        }
    },
    methods:{
        async print_transaction_data(){
            this.print_dialog = false;
            var acc = ""
            var type = ""
            var settled = ""
            var transaction = ""
            var errors = false
            if(this.print_acc == null){
                errors = true
            }else if(this.print_acc == 0){
                acc = "ALL",
                type = "ALL"
            }else{
                acc = this.print_acc;
                if(this.print_type_name == null){
                    errors = true
                }else if(this.print_type_name == 0){
                    type = "ALL"
                }else{
                    type = this.print_type_name;
                }
            }
            // settle_options:["Settled","Not Settled","Both"]
            // transaction_options:["Expense","Settlements","Both"]
            if(this.print_settle == "Both"){
                settled = "ALL"
            }else if(this.print_settle == "Settled"){
                settled = "YES"
            }else if(this.print_settle == "Not Settled"){
                settled = "NO"
            }else{
                errors = true
            }

            if(this.print_transaction == "Both"){
                transaction = "ALL"
            }else if(this.print_transaction == "Expense"){
                transaction = "OUT"
            }else if(this.print_transaction == "Settlements"){
                transaction = "IN"
            }else{
                errors = true;
            }

            if(!errors){
                this.print_data_list = await PettyService.GetTransactions(acc,type,settled,transaction);
                this.documentation_dialog = true;
            }
            
        },
        async complete_expense(){

            var selected_account = null
            for(var i = 0 ; i < this.all_accounts.length ; i++){
                if(this.all_accounts[i].name == this.expense_account){
                    selected_account = this.all_accounts[i].id;
                }
            }
            var selected_type = null
            if(selected_account != null){
                for(var j = 0 ; j < this.expense_types.length ; j++){
                    if(this.expense_types[j].account == selected_account){
                        selected_type = this.expense_types[j].id
                    }
                }
            }
            var selected_settle = null
            if(selected_type != null){
                if(this.expense_settled){
                    selected_settle = "YES"
                }else{
                    selected_settle = "NO"
                }
            }
            if(selected_settle != null){
                await PettyService.Expense(selected_account,selected_type,this.expense_reason,this.expense_amount,this.remarks_expense,selected_settle)
            }
            this.expense_dialog = false;
            this.get_all_transactions();
            this.expense_account = null;
            this.expensed_type = null;
            this.expense_reason = "";
            this.expense_amount = 0;
            this.remarks_expense = ""
            this.expense_settled =  false
        },
        async get_all_transactions(){
            this.petty_transactions = await PettyService.GetTransactions("ALL","ALL","ALL","ALL");
        },
        async complete_setoff(){
            var acc_stage = 0
            for(var i = 0 ; i < this.all_accounts.length ; i++){
                if(this.all_accounts[i].name == this.setoff_account){
                    acc_stage = this.all_accounts[i].id
                }
            }
            if(acc_stage != 0){
                await PettyService.SetOff(acc_stage,this.setoff_reason,this.setoff_amount,this.setoff_remarks,"YES");
                this.get_all_transactions();
                this.setoff_dialog = false
            }
        }
    },
    async created(){
        this.all_accounts = await PettyService.GetAllAccounts();
        this.get_all_transactions();
    }
}
</script>

<style>

</style>