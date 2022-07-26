<template>
  <v-card flat>
      <v-card-title>Payments</v-card-title>
      <v-container>
          <v-row>
              <v-col cols="12" sm="12" xs="12" md="6" lg="6">
                  <v-card style="padding:1rem">
                      <v-card-title>Advance Payments</v-card-title>
                      <button @click="stakeSelectDialog = true" class="new_btn_style">Select Supplier</button>
                      <p><b>Supplier : </b><span v-if="selectedStake != null">
                          {{selectedStake.name}}<br>
                          {{selectedStake.address1}}<br>
                          {{selectedStake.address2}}<br>
                          {{selectedStake.address3}}<br></span>
                          <br/><b>total : </b> {{this.advance_total.toFixed(2)}}</p>
                      <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-switch v-model="cash" inset label="Cash"></v-switch>
                          <v-spacer></v-spacer>
                          <v-switch v-model="bank" inset label="Bank"></v-switch>
                          <v-spacer></v-spacer>
                          <v-switch v-model="cheque" inset label="Cheque"></v-switch>
                          <v-spacer></v-spacer>
                      </v-card-actions>
                      <div v-if="cash">
                          <v-text-field label="Cash Amount" step="0.01" type="number" v-model="cash_am" outlined></v-text-field>
                      </div>
                      <div v-if="bank">
                          <v-card-actions>
                              <v-text-field label="Transaction ID" v-model="bank_id" outlined></v-text-field>
                              <v-spacer></v-spacer>
                              <v-text-field label="Amount" step="0.01" type="number" v-model="bank_am" outlined></v-text-field>
                          </v-card-actions>
                      </div>
                      <div v-if="cheque">
                          <v-card-actions>
                              <v-text-field label="Cheque Number" v-model="cheque_id" outlined></v-text-field>
                                <v-spacer></v-spacer>
                                <v-text-field label="Cheque Amount" v-model="cheque_am" outlined step="0.01" type="number"></v-text-field>
                          </v-card-actions>
                      </div>
                      <v-btn @click="pay_recipt_advance()" dark>Pay and Take Recipt</v-btn>
                  </v-card>
              </v-col>
              <v-col cols="12" sm="12" xs="12" md="6" lg="6">
                  <v-card style="padding:1rem">
                      <v-card-title>Credit Payments</v-card-title>
                      <button class="new_btn_style" @click="selectGrnDialog = true">Select GRN</button>
                      <p v-if="selectedGrn != null"><b>GRN Id : </b>{{selectedGrn.id}}<br>
                      <b>Supplier : </b>{{selectedGrn.name}},{{selectedGrn.address1}},{{selectedGrn.address2}},{{selectedGrn.address3}}<br>
                      <b>Final : </b>{{selectedGrn.final}}<br>
                      <b>Now Paid : </b>{{credit_paid.toFixed(2)}}<br>
                      <b>Need to Pay :</b> {{Number(selectedGrn.final) - Number(selectedGrn.paid)}}</p>
                      <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-switch v-model="c_cash" inset label="Cash"></v-switch>
                          <v-spacer></v-spacer>
                          <v-switch v-model="c_bank" inset label="Bank"></v-switch>
                          <v-spacer></v-spacer>
                          <v-switch v-model="c_cheque" inset label="Cheque"></v-switch>
                          <v-spacer></v-spacer>
                      </v-card-actions>
                      <div v-if="c_cash">
                          <v-text-field label="Cash Amount" step="0.01" type="number" v-model="c_cash_am" outlined></v-text-field>
                      </div>
                      <div v-if="c_bank">
                          <v-card-actions>
                              <v-text-field label="Transaction ID" v-model="c_bank_id" outlined></v-text-field>
                              <v-spacer></v-spacer>
                              <v-text-field label="Amount" step="0.01" type="number" v-model="c_bank_am" outlined></v-text-field>
                          </v-card-actions>
                      </div>
                      <div v-if="c_cheque">
                          <v-card-actions>
                              <v-text-field label="Cheque Number" v-model="c_cheque_id" outlined></v-text-field>
                                <v-spacer></v-spacer>
                                <v-text-field label="Cheque Amount" v-model="c_cheque_am" outlined step="0.01" type="number"></v-text-field>
                          </v-card-actions>
                      </div>
                      <v-btn @click="grn_credit_add()" dark>Pay</v-btn>
                  </v-card>
              </v-col>
          </v-row>
      </v-container>
      <v-dialog v-model="selectGrnDialog" width="70rem">
          <v-card style="padding:1rem">
              <v-card-actions>
                  <v-card-title>Add Credited Grn</v-card-title>
                  <v-spacer></v-spacer>
                  <v-text-field label="search" v-model="searchGrn" ></v-text-field>
              </v-card-actions>
              <v-data-table :search="searchGrn" :items="allCreditedGrns" :headers="creditGrnHeaders">
                  <template v-slot:item.controls="{item}">
                    <v-btn small icon  @click="add_grn(item)">
                    <v-icon dark>mdi-plus</v-icon>
                    </v-btn>
                </template>
              </v-data-table>
          </v-card>
      </v-dialog>
       <v-dialog v-model="advance_recipt_dialog" max-width="30rem">
              <v-card>
                  <v-toolbar dark>
                      <v-toolbar-title>Advance Recipt</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-btn @click="print_advance();" icon>
                          <v-icon>mdi-printer-pos</v-icon>
                      </v-btn>
                      <v-btn @click="advance_recipt_dialog = false" icon>
                          <v-icon>mdi-close</v-icon>
                      </v-btn>
                  </v-toolbar>
                  <div id="print_advance_area">
                      <div v-if="inserted_advance_data != null" style="font-family: Arial, Helvetica, sans-serif;padding:1rem">
                         <div style="text-align:center;border-bottom:2px solid #000000">
                            <h2>{{address.name}}</h2>
                            <p><b>{{address.add1}},{{address.add2}},{{address.add3}}</b><br/>{{address.email}}<br/>{{address.tele}}
                            <br> <b>Advance Payment</b> </p>
                        </div>
                        <div style="text-align:center">
                            <p>
                            <b>ID : {{inserted_advance_data.id}} <br>
                            Date : </b>{{inserted_advance_data.date}}
                            <b>Supplier ID :</b>{{inserted_advance_data.stake_id}} <br>
                            Supplier : {{inserted_advance_data.name}} <br>
                            {{inserted_advance_data.address1}} <br>
                            {{inserted_advance_data.address2}} <br>
                            {{inserted_advance_data.address3}} <br>
                            {{inserted_advance_data.email}} <br>
                        </p>
                        </div>
                        <table border="1" style="border-collapse:collapse;width:100%">
                            <tr>
                                <th>Type</th>
                                <th>ID</th>
                                <th>Amount</th>
                            </tr>
                            <tr>
                                <td>Bank</td>
                                <td>{{inserted_advance_data.bankid}}</td>
                                <td style="text-align:right">{{inserted_advance_data.bank}}</td>
                            </tr>
                            <tr>
                                <td>Cheque</td>
                                <td>{{inserted_advance_data.chequeid}}</td>
                                <td style="text-align:right">{{inserted_advance_data.cheque}}</td>
                            </tr>
                            <tr>
                                <td colspan="2">Cash</td>
                                <td style="text-align:right">{{inserted_advance_data.cash}}</td>
                            </tr>
                            <tr>
                                <td colspan="2">Total</td>
                                <td style="text-align:right">{{inserted_advance_data.total}}</td>
                            </tr>
                            <tr>
                                <td colspan="2">Available</td>
                                <td style="text-align:right">{{inserted_advance_data.available}}</td>
                            </tr>
                        </table>
                      </div>
                  </div>
              </v-card>
          </v-dialog>
      <v-dialog v-model="stakeSelectDialog" width="70rem">
          <v-card style="padding:1rem">
              <v-card-actions>
                  <v-card-title>Add Supplier</v-card-title>
                  <v-spacer></v-spacer>
                  <v-text-field label="search" v-model="searchStake"></v-text-field>
              </v-card-actions>
              <v-data-table :search="searchStake" :headers="stakeSelectHeader" :items="allStakeholders">
                <template v-slot:item.controls="{item}">
                    <v-btn small icon  @click="add_stakeholder(item)">
                    <v-icon dark>mdi-plus</v-icon>
                    </v-btn>
                </template>
              </v-data-table>
              <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn @click="stakeSelectDialog = false" text>Cancel</v-btn>
              </v-card-actions>
          </v-card>
      </v-dialog>
  </v-card>
</template>

<script>
import PaymentService from '../../PaymentService';
import StakeService from '../../StakeService'
import DocumentService from '../../Document'

export default {
    name:"OPayments",
    data(){
        return {
            searchStake:'',
            searchGrn:'',
            stakeSelectDialog:false,
            selectGrnDialog:false,
            selectedStake:null,
            inserted_advance_data:null,
            address:null,
            advance_recipt_dialog:false,
            cash:false,
            bank:false,
            cheque:false,
            cash_am:0,
            credit_paid:0,
            bank_am:0,
            cheque_am:0,
            advance_total:0,
            stakeSelectHeader:[
                {
                    text:"",
                    value:"controls"
                },{
                    text:"Name",
                    value:"name"
                },{
                    text:"Address Line 1",
                    value:"address1"
                },{
                    text:"Address Line 2",
                    value:"address2"
                },{
                    text:"Address Line 3",
                    value:"address3"
                },{
                    text:"E-mail",
                    value:"email"
                },{
                    text:"Telephone",
                    value:"telephone"
                }
            ],
            bank_id:'',
            cheque_id:'',
            c_cash:false,
            c_bank:false,
            c_cheque:false,
            c_cash_am:0,
            c_bank_am:0,
            c_cheque_am:0,
            c_bank_id:'',
            c_cheque_id:'',
            allStakeholders:[],
            allCreditedGrns:[],
            creditGrnHeaders:[
                {
                    text:"",
                    value:"controls"
                },{
                    text:"ID",
                    value:"id"
                },{
                    text:"Name",
                    value:"name"
                },{
                    text:"Reference",
                    value:"reference"
                },{
                    text:"Total",
                    value:"total"
                },{
                    text:"Final",
                    value:"final"
                },{
                    text:"Paid",
                    value:"paid"
                }
            ],
            selectedGrn:null,
            user:0
        }
    },
    methods:{
        add_stakeholder(details){
            this.selectedStake = details;
            this.stakeSelectDialog = false;
        },
        async pay_recipt_advance(){
            var total = Number(this.cash_am) + Number(this.cheque_am) + Number(this.bank_am);
            this.inserted_advance_data  = await PaymentService.InsertAdvance(new Date().toISOString().slice(0,10),this.selectedStake.id,total,this.cash_am,this.bank_id,this.bank,this.cheque_id,this.cheque_am)
            this.advance_recipt_dialog = true;
            this.cash_am = 0
            this.cheque_am = 0
            this.bank_am = 0
            this.cheque_id = ''
            this.bank_id = ''
            this.cash = false
            this.bank = false
            this.cheque = false
            this.selectedStake = null
            
        },
        add_grn(item){
            this.selectedGrn = item;
            this.selectGrnDialog = false;
        },
        async grn_credit_add(){
            await PaymentService.InsertCreditGrn(this.selectedGrn.id,this.credit_paid,this.c_cash_am,this.c_bank_am,this.c_cheque_am,this.c_bank_id,this.c_cheque_id,this.user)
            this.allCreditedGrns = await DocumentService.GetCreditGrn();
            this.c_cash_am = 0
            this.c_bank_am = 0
            this.c_cheque_am = 0
            this.c_cash = false
            this.c_bank = false
            this.c_cheque = false
            this.c_bank_id = ''
            this.c_cheque_id = ''
            this.selectedGrn = null
        },
        calculate_paid(){
            this.credit_paid = Number(this.c_cash_am)+Number(this.c_bank_am)+Number(this.c_cheque_am)
        },
        calculate_advanced(){
            this.advance_total = Number(this.cash_am) + Number(this.cheque_am) + Number(this.bank_am)
        }
    },
    async created(){
        this.address = {
          name:this.$store.getters.getName,
          add1:this.$store.getters.getAddress.add1,
          add2:this.$store.getters.getAddress.add2,
          add3:this.$store.getters.getAddress.add3,
          email:this.$store.getters.getEmail,
          tele:this.$store.getters.getTelephone
      }
        this.allStakeholders = await StakeService.GetAllStakes('Suppliers')
        this.allCreditedGrns = await DocumentService.GetCreditGrn();
         this.user = localStorage.getItem('UserToken');
    },
    watch:{
        'c_cash_am':function(){
            this.calculate_paid();
        },
        'c_bank_am':function(){
            this.calculate_paid();
        },
        'c_cheque_am':function(){
            this.calculate_paid();
        },
        'cash_am':function(){
            this.calculate_advanced();
        },
        'bank_am':function(){
            this.calculate_advanced();
        },
        'cheque_am':function(){
            this.calculate_advanced();
        }
    }
}
</script>

<style>
.new_btn_style{
    width: 100%;
    background-color: grey;
    color: #ffffff;
}
</style>