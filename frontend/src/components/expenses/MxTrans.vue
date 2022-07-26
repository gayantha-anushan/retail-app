<template>
  <v-container fluid ma-0 pa-0>
      <v-row>
          <v-col cols="12" xs="12" sm="12" md="4" lg="4" xl="3" style="padding:2rem">
              <v-card elevation="2" style="padding:1rem">
                  <v-card-actions>
                      <v-card-title>Expense</v-card-title>
                      <v-spacer></v-spacer>
                      <v-btn @click="settlement_dialog = true" dark>Settlement</v-btn>
                  </v-card-actions>
                  <v-select :items="all_acc" item-text="name" item-value="id" v-model="selected_account_expense"  label="Select Account"></v-select>
                  <v-select :items="expense_types" item-text="name" item-value="id" v-model="selected_type_expense" label="Select Type"></v-select>
                  <v-text-field v-model="expense_description" label="Description"></v-text-field>
                  <v-text-field v-model="expense_amount" label="Amount" type="number" step="0.01"></v-text-field>
                  <v-textarea v-model="expense_remarks" outlined label="Remarks"></v-textarea>
                  <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn @click="main_expense()" dark>Add</v-btn>
                  </v-card-actions>
              </v-card>
          </v-col>
          <v-col cols="12" xs="12" sm="12" md="8" lg="8" xl="9">
              <v-card>
                  <v-card-actions>
                      <v-spacer>
                      </v-spacer>
                      <v-text-field label="Search" v-model="search_data"></v-text-field>
                  </v-card-actions>
                  <v-data-table
                    :headers="data_table_headers"
                    :items="all_transi"
                    :search="search_data"
                    ></v-data-table>
              </v-card>
          </v-col>
      </v-row>
      <v-dialog v-model="settlement_dialog" max-width="30rem">
          <v-card style="padding:1rem">
              <v-card-title>Settlement</v-card-title>
              <!-- Select Account -->
              <v-select :items="all_acc" item-text="name" item-value="id" v-model="selected_account_setoff" label="Select Account"></v-select>
              <!-- select Type -->
              <v-select :items="setoff_types" item-text="name" item-value="id" v-model="selected_type_setoff" label="select Type"></v-select>
              <!-- Select Transaction -->
              <v-select v-model="selected_trans" return-object item-text="description" :items="setoff_transactions" label="Select Transaction"></v-select>
              <!-- add Accounting Details -->
              Amount to Complete :<span v-if="selected_trans != null"> {{Number(selected_trans.amount) - Number(selected_trans.completed)}}</span><br>
              Paid Now : {{total_setoff}}
              <v-card-actions>
                  <v-switch label="Cash" v-model="cash_entry" inset></v-switch>
                  <v-spacer></v-spacer>
                  <v-switch label="Bank" v-model="bank_entry" inset></v-switch>
                  <v-spacer></v-spacer>
                  <v-switch label="Cheque" v-model="cheq_entry" inset></v-switch>
              </v-card-actions>
              <div v-if="cash_entry">
                  <v-text-field v-model="setoff_cash" label="Cash Amount"></v-text-field>
              </div>
              <div v-if="bank_entry">
                  <v-card-actions>
                      <v-text-field v-model="setoff_bank_id" label="Transaction ID"></v-text-field>
                      <v-spacer></v-spacer>
                      <v-text-field v-model="setoff_bank" label="Amount"></v-text-field>
                  </v-card-actions>
              </div>
              <div v-if="cheq_entry">
                  <v-card-actions>
                      <v-text-field v-model="setoff_cheque_id" label="Cheque ID"></v-text-field>
                      <v-spacer></v-spacer>
                      <v-text-field v-model="setoff_cheque" label="Amount"></v-text-field>
                  </v-card-actions>
              </div>
              <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn @click="settlement_dialog = false">Cancel</v-btn>
                  <v-btn  @click="main_setoff()"  dark>Settle</v-btn>
              </v-card-actions>
          </v-card>
      </v-dialog>
       <v-snackbar v-model="snackbar" :timeout="timeout">
        {{error}}
        <template v-slot:action="{ attrs }">
          <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">Close</v-btn>
        </template>
      </v-snackbar>
  </v-container>
</template>

<script>
import MainTransService from '../../MainTransService'
export default {
    name:"MxTrans",
    data(){
        return {
            data_table_headers:[
                {
                    text:"ID",
                    value:"id"
                },{
                    text:"Account",
                    value:"account_name"
                },{
                    text:"Type",
                    value:"type_name"
                },{
                    text:"Description",
                    value:"description"
                },{
                    text:"Amount",
                    value:"amount"
                },{
                    text:"Completed",
                    value:"completed"
                }
            ],
            settlement_dialog:false,
            cash_entry:false,
            bank_entry:false,
            all_transi:[],
            search_data:"",
            cheq_entry:false,
            all_acc:[],
            selected_type_expense:null,
            selected_account_expense:null,
            expense_types:[],
            expense_description:'',
            expense_amount:'',
            error:'',
            timeout:2000,
            snackbar:false,
            expense_remarks:'',
            selected_account_setoff:null,
            setoff_types:[],
            selected_type_setoff:null,
            setoff_transactions:[],
            selected_trans:null,
            setoff_cash:0,
            setoff_bank:0,
            setoff_cheque:0,
            setoff_bank_id:"",
            setoff_cheque_id:"",
            total_setoff:0,
        }
    },
    async created(){
        this.all_acc = await MainTransService.GetAllAccounts()
        this.load_all_trans();
    },
    watch:{
        'selected_account_expense':async function(){
            if(this.selected_account_expense != null){
                this.expense_types = await MainTransService.GetTypeByAccount(this.selected_account_expense);
            }
        },
        'selected_account_setoff':async function(){
            if(this.selected_account_setoff != null){
                this.setoff_types = await MainTransService.GetTypeByAccount(this.selected_account_setoff);

            }
        },
        'selected_type_setoff':async function(){
            if(this.selected_type_setoff != null){
                this.setoff_transactions = await MainTransService.GetMainTransactions(this.selected_account_setoff,this.selected_type_setoff,"not completed");
            }
        },
        "setoff_cash":function (){
            this.total_setoff = Number(this.setoff_cash) + Number(this.setoff_bank) + Number(this.setoff_cheque);
        },
         "setoff_bank":function (){
            this.total_setoff = Number(this.setoff_cash) + Number(this.setoff_bank) + Number(this.setoff_cheque);
        },
         "setoff_cheque":function (){
            this.total_setoff = Number(this.setoff_cash) + Number(this.setoff_bank) + Number(this.setoff_cheque);
        },
    },
    methods:{
        async main_expense(){
            var date = new Date().toISOString().slice(0,10)
            await MainTransService.ExpenseMain(date,this.selected_account_expense,this.selected_type_expense,this.expense_description,this.expense_amount,this.expense_remarks)
            this.error = "Successfully Expensed";
            this.snackbar = true
            this.selected_account_expense = null;
            this.selected_type_expense = null;
            this.expense_description = "";
            this.expense_amount = "";
            this.expense_remarks = "";
            this.load_all_trans()
        },
        async main_setoff(){
            var date = new Date().toISOString().slice(0,10)
            await MainTransService.SetOff(date,this.selected_trans.id,this.total_setoff,this.setoff_cash,this.setoff_bank,this.setoff_cheque,this.setoff_cheque_id,this.setoff_bank_id);
            this.error = "Successfully Setoff";
            this.snackbar = true;
            this.load_all_trans()
            this.settlement_dialog = false;
        },
        async load_all_trans(){
            this.all_transi = await MainTransService.GetMainTransactions("ALL","ALL","ALL");
        }
    }
}
</script>

<style>

</style>