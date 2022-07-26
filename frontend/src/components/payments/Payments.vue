<template>
  <div>
      <v-tabs>
      <v-tab>Recipt</v-tab>
      <v-tab-item>
          <v-card flat>
              <v-card-title>Recipt</v-card-title>
              <v-container>
                    <v-row>
                        <v-col md="6" sm="12">
                            <v-card style="padding:1rem">
                                <v-card-title>Advance Received</v-card-title>
                                <v-form>
                                    <v-card flat outlined style="padding:20px">
                                        <p v-if="selectedStake.length > 0">
                                            <b>{{selectedStake[0].name}}</b><br>
                                            {{selectedStake[0].address1}}<br>
                                            {{selectedStake[0].address2}}<br>
                                            {{selectedStake[0].address3}}<br>
                                            <i>{{selectedStake[0].email}}<br>
                                            {{selectedStake[0].telephone}}</i>
                                        </p>
                                        <v-btn @click="custDialog = true" style="margin-bottom:1rem" v-if="selectedStake.length == 0" text>Add Customer</v-btn>
                                    </v-card>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-switch v-model="abank" inset label="Bank Pay"></v-switch>
                                        <v-spacer></v-spacer>
                                        <v-switch v-model="acash" inset label="Cash Pay"></v-switch>
                                        <v-spacer></v-spacer>
                                        <v-switch v-model="acheque" inset label="Cheque Pay"></v-switch>
                                        <v-spacer></v-spacer>
                                    </v-card-actions>
                                    <v-card-subtitle v-if="abank">Bank Payment</v-card-subtitle>
                                    <v-card-actions v-if="abank">
                                        <v-text-field v-model="btid" label="Transaction ID" style="margin:2px"  outlined ></v-text-field>
                                        <v-text-field v-model="btamount" label="Amount" style="margin:2px" step="0.01" type="number" outlined ></v-text-field>
                                    </v-card-actions >
                                    <v-card-subtitle v-if="acheque">Cheque Payment</v-card-subtitle>
                                    <v-card-actions v-if="acheque">
                                        <v-text-field v-model="chid" label="Cheque ID" style="margin:2px"  outlined ></v-text-field>
                                        <v-text-field v-model="chamount" label="Amount" style="margin:2px" step="0.01" type="number" outlined ></v-text-field>
                                    </v-card-actions>
                                    <v-card-subtitle v-if="acash" >Cash Payment</v-card-subtitle>
                                    <v-text-field v-model="cashamount" label="Amount" v-if="acash" step="0.01" type="number" outlined ></v-text-field>
                                    <v-btn @click="addAdvance()" dark>Add & Take Recipt</v-btn>
                                </v-form>
                            </v-card>
                        </v-col>
                        <v-col md="6" sm="12">
                            <v-card style="padding:1rem">
                                <v-card-title>Deter Received</v-card-title>
                                <v-form>
                                    <v-card outlined flat style="padding:20px">
                                        <p v-if="addedInv != null">ID : {{addedInv.id}}<br>Amount : {{addedInv.maxpay}}</p>
                                        <v-btn style="margin-bottom:1rem" v-if="addedInv == null" @click="invDialog = true"  text>Invoice</v-btn>
                                    </v-card>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-switch v-model="dbank" inset label="Bank Pay"></v-switch>
                                        <v-spacer></v-spacer>
                                        <v-switch v-model="dcash" inset label="Cash Pay"></v-switch>
                                        <v-spacer></v-spacer>
                                        <v-switch v-model="dcheque" inset label="Cheque Pay"></v-switch>
                                        <v-spacer></v-spacer>
                                    </v-card-actions>
                                    <v-card-subtitle v-if="dbank">Bank Payment</v-card-subtitle>
                                    <v-card-actions v-if="dbank">
                                        <v-text-field v-model="cbtid" label="Transaction ID" style="margin:2px"  outlined ></v-text-field>
                                        <v-text-field v-model="cbtamount" label="Amount" style="margin:2px" step="0.01" type="number" outlined ></v-text-field>
                                    </v-card-actions >
                                    <v-card-subtitle v-if="dcheque">Cheque Payment</v-card-subtitle>
                                    <v-card-actions v-if="dcheque">
                                        <v-text-field v-model="cchid" label="Cheque ID" style="margin:2px"  outlined ></v-text-field>
                                        <v-text-field v-model="cchamount" label="Amount" style="margin:2px" step="0.01" type="number" outlined ></v-text-field>
                                    </v-card-actions>
                                    <v-card-subtitle v-if="dcash" >Cash Payment</v-card-subtitle>
                                    <v-text-field v-model="ccashamount" label="Amount" v-if="dcash" step="0.01" type="number" outlined ></v-text-field>
                                    <v-btn  @click="insertCredit()" dark>Add & Take Recipt</v-btn>
                                </v-form>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
          </v-card>
          <v-dialog v-model="invDialog" max-width="80rem">
              <v-card flat>
                  <v-card-actions>
                      <v-card-title>Select Credited Invoice</v-card-title>
                      <v-spacer></v-spacer>
                      <v-text-field v-model="invSearch"></v-text-field>
                  </v-card-actions>
                  <v-data-table v-model="selectedInvoice" :single-select="true" show-select :search="invSearch" :items="incompletedInvoices" :headers="invHead"></v-data-table>
                  <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" @click="cancel()" text>Cancel</v-btn>
                      <v-btn color="primary" @click="addInvoice()" dark>Add</v-btn>
                  </v-card-actions>
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
                            <b>Customer ID :</b>{{inserted_advance_data.stake_id}} <br>
                            Customer : {{inserted_advance_data.name}} <br>
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
          <v-dialog v-model="custDialog" max-width="40rem">
              <v-card flat>
                  <v-card-actions>
                      <v-card-title>Select Customer</v-card-title>
                      <v-spacer></v-spacer>
                      <v-text-field v-model="custSearch"></v-text-field>
                  </v-card-actions>
                  <v-data-table :items="allStakes" :search="custSearch" :headers="headers" show-select :single-select="true" v-model="selectedStake"></v-data-table>
                  <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" @click="cancel()" text>Cancel</v-btn>
                      <v-btn color="primary" @click="custDialog = false" v-if="selectedStake.length > 0" dark>Add</v-btn>
                  </v-card-actions>
              </v-card>
          </v-dialog>
      </v-tab-item>
      <v-tab>Payment for suppliers</v-tab>
      <v-tab-item><OPayments/></v-tab-item>
      <v-tab>Set-off</v-tab>
      <v-tab-item><payfor-supplier/></v-tab-item>
      <v-tab>Main Expenses</v-tab>
      <v-tab-item><MxTrans/></v-tab-item>
  </v-tabs>
  <v-snackbar v-model="snackbar" :timeout="timeout">
        {{error}}
        <template v-slot:action="{ attrs }">
          <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">Close</v-btn>
        </template>
      </v-snackbar>
  </div>
  
</template>

<script>
import StakeService from '../../StakeService'
import PaymentService from '../../PaymentService'
import OPayments from './OPayments.vue'
import PayforSupplier from './PayforSupplier.vue'
import MxTrans from '../expenses/MxTrans.vue'

export default {
  components: { PayforSupplier ,OPayments,MxTrans },
    name:"Advance",
    data() {
        return {
            allStakes:[],
            selected:null,
            custSearch:'',
            invSearch:'',
            selectedStake:[],
            selectedInvoice:[],
            custDialog:false,
            invDialog:false,
            abank:false,
            acheque:false,
            acash:false,
            invHead:[
                {
                    text:"ID",
                    value:"incid"
                },
                {
                    text:"Date",
                    value:"date"
                },
                {
                    text:"Customer",
                    value:"name"
                },
                {
                    text:"Credited",
                    value:"creditamount"
                },
                {
                    text:"Total",
                    value:"total"
                }
            ],
            dbank:false,
            dcash:false,
            dcheque:false,
            headers:[{
                text:"Name",
                value:"name"
            },{
                text:"E-mail",
                value:"email"
            },{
                text:"Telephone",
                value:"telephone"
            }],
            btid:'',
            btamount:0,
            chid:'',
            chamount:0,
            cashamount:0,
            cbtid:'',
            cbtamount:0,
            inserted_advance_data:null,
            advance_recipt_dialog:false,
            cchid:'',
            cchamount:0,
            ccashamount:0,
            snackbar:false,
            error:'',
            timeout:2000,
            incompletedInvoices:[],
            addedInv:null,
            reciptAdvDialog:false,
            dialogVal:null,
            address:null,
        }
    },
    async created() {
         this.address = {
          name:this.$store.getters.getName,
          add1:this.$store.getters.getAddress.add1,
          add2:this.$store.getters.getAddress.add2,
          add3:this.$store.getters.getAddress.add3,
          email:this.$store.getters.getEmail,
          tele:this.$store.getters.getTelephone
      }
        this.allStakes = await StakeService.GetAllStakes("Customer");
        this.incompletedInvoices = await PaymentService.GETIncompletedInvoices();
        if(this.$store.getters.getName == null){
            await this.$store.commit("updateSettings")
        }
    },
    methods: {
        print_advance(){
            this.$htmlToPaper("print_advance_area")
        },
        cancel(){
            this.selectedStake.length = 0
            this.custDialog = false
            this.selectedInvoice.length = 0
            this.invDialog = false;
        },
        async addAdvance(){
            if(this.selectedStake.length == 0 ){
                this.error = "Please Add Customer before Submit"
                this.snackbar = true;
            }else{
                var total = Number(this.btamount) + Number(this.chamount) + Number(this.cashamount)
                if(total == 0){
                    this.error = "Advanced Amount cannot be zero";
                    this.snackbar = true;
                }else{
                    this.inserted_advance_data = await PaymentService.InsertAdvance(new Date().toISOString().slice(0,10),this.selectedStake[0].id,total,this.cashamount,this.btid,this.btamount,this.chid,this.chamount);
                    this.advance_recipt_dialog = true;
                }
            }
            this.selectedStake.length = 0;
            this.abank = false;
            this.acash = false;
            this.acheque = false;
            this.btid = "";
            this.btamount = 0;
            this.chid = ""
            this.chamount = 0;
            this.cashamount = 0
        },
        addInvoice(){
            var inv = {
                id:this.selectedInvoice[0].id,
                maxpay:this.selectedInvoice[0].creditamount,
            }
            this.addedInv = inv;
            this.invDialog = false;
        },
        async insertCredit(){
            var tr = {
                amount:Number(this.cbtamount)+Number(this.cchamount)+Number(this.ccashamount),
                cashamount:Number(this.ccashamount),
                banktransactionid:this.cbtid,
                bankamount:Number(this.cbtamount),
                chequeNum:this.cchid,
                chequeamount:Number(this.cchamount)
            }
            this.dbank = false;
            this.dcash = false;
            this.dcheque = false;
            this.cbtid = "";
            this.cbtamount = 0;
            this.cchid = "";
            this.cchamount = 0;
            this.ccashamount = 0;
            if(Number(tr.amount) < Number(this.addedInv.maxpay)){
                await PaymentService.InsertCreditPay(tr,tr.amount,this.addedInv.id)
                this.incompletedInvoices = await PaymentService.GETIncompletedInvoices();
                this.error = "Credit Payment Added Success!"
                this.snackbar = true;
            }else{
                this.error = "Paid amount exceed credited amount. credited amount is "+this.addedInv.maxpay;
                this.snackbar = true;
            }
            this.addedInv = null
        }
    },

}
</script>

<style>

</style>