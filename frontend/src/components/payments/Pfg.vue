<template>
  <v-card flat>
      <v-card-actions>
          <v-card-title>Pays For Grns</v-card-title>
          <v-spacer></v-spacer>
          <v-btn @click="payNow()" dark>Pay Now!</v-btn>
      </v-card-actions>
      <v-card-actions>
          <v-spacer></v-spacer>
          <v-chip label class="dark_color" style="margin:5px">Num of Grns :{{selectedGrns.length}} </v-chip>
          <v-chip label class="dark_color" style="margin:5px">Num of Advances :{{selectedAdvances  .length}} </v-chip>
          <v-chip label class="dark_color" style="margin:5px">GRN Total :{{grnTotal}} </v-chip>
          <v-chip label class="dark_color" style="margin:5px">Advance Total :{{advanceTotal}} </v-chip>
          <v-spacer></v-spacer>
      </v-card-actions>
      <v-container ma-0 pa-0 fluid>
          <v-row>
              <v-col>
                  <v-card flat>
                      <v-card-actions>
                          <v-card-title>GRNs</v-card-title>
                          <v-spacer></v-spacer>
                          <v-text-field v-model="search_grn" label="Search"></v-text-field>
                      </v-card-actions>
                      <v-data-table
                      v-model="selectedGrns"
                      :search="search_grn"
                      show-select
                      :items="unpaidGrns"
                      :headers="grnHeaders"
                      >
                      <template v-slot:item.need_to_pay="{item}">
                            <p>{{Number(item.final).toFixed(2) - Number(item.paid).toFixed(2)}}</p>
                        </template> 
                      </v-data-table>
                  </v-card>
              </v-col>
              <v-col>
                  <v-card flat>
                      <v-card-actions>
                          <v-card-title>Advances</v-card-title>
                          <v-spacer></v-spacer>
                          <v-text-field label="Search" v-model="search_advance"></v-text-field>
                      </v-card-actions>
                      <v-data-table
                      :items="unpaidAdvances"
                      :search="search_advance"
                      v-model="selectedAdvances"
                      :single-select="true"
                      show-select
                      :headers="advancesHeaders"
                      ></v-data-table>
                  </v-card>
              </v-col>
          </v-row>
      </v-container>
      <v-snackbar v-model="snackbar" :timeout="timeout">
        {{error}}
        <template v-slot:action="{ attrs }">
          <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">Close</v-btn>
        </template>
      </v-snackbar>
  </v-card>
</template>

<script>
import PaymentService from '../../PaymentService'
import DocumentService from '../../Document'

export default {
    props:["supplier"],
    data(){
        return{
            snackbar:false,
            timeout:2000,
            error:'',
            search_grn:'',
            search_advance:'',
            unpaidAdvances:[],
            selectedAdvances:[],
            advancesHeaders:[
                {
                    text:"ID",
                    value:"id"
                },{
                    text:"Date",
                    value:"date"
                },{
                    text:"Total",
                    value:"total"
                },{
                    text:"Available",
                    value:"available"
                }
            ],
            unpaidGrns:[],
            selectedGrns:[],
            grnTotal:0,
            advanceTotal:0,
            grnHeaders:[
                {
                    text:"ID",
                    value:"id"
                },{
                    text:"Date",
                    value:"date"
                },{
                    text:"GRN Final",
                    value:"grn_final"
                },{
                    text:"Returns",
                    value:"total_returns"
                },{
                    text:"Paid",
                    value:"paid_yet"
                },{
                    text:"Finalized",
                    value:"final"
                }
            ],
            grnPendingAmount:0,
            advanceAvailableAmount:0
        }
    },
    methods:{
        payNow(){
            if(this.selectedGrns.length == 1 && this.selectedAdvances.length == 1){
                if(Number(this.selectedAdvances[0].available)*Number(this.selectedGrns[0].final) > 0){
                    this.send_req();
                }else{
                    this.error = "You must need to select same signed values"
                    this.snackbar = true;
                }
            }else if(this.selectedGrns.length == 2 && this.selectedAdvances.length == 0){
                if(Number(this.selectedGrns[0].final)*Number(this.selectedGrns[1].final) < 0){
                    this.send_req()
                }else{
                    this.error = "You must need to select different signed GRNs"
                    this.snackbar = true;
                }
            }else{
                this.error = "Number of selected Items are incompatible with system"
                this.snackbar = true
            }
        },
        async send_req(){
            PaymentService.PayAdvanceGrn(this.selectedGrns,this.selectedAdvances);
        }
    },
    watch:{
        "selectedGrns":function(){
            this.grnTotal = 0;
            for(var i = 0 ; i < this.selectedGrns.length ; i++){
                this.grnTotal += Number(this.selectedGrns[i].final);
            }
        },
        "selectedAdvances":function(){
            this.advanceTotal = 0;
            for(var i = 0 ; i < this.selectedAdvances.length ; i++){
                this.advanceTotal += Number(this.selectedAdvances[i].available)
            }
        },
        'supplier':async function(){
            this.unpaidAdvances = await PaymentService.getUnpaidAdvancesSupplier(this.supplier)
            this.unpaidGrns = await DocumentService.GetUnpaidDocuments(this.supplier);
        }
    },
    async created(){
        this.unpaidAdvances = await PaymentService.getUnpaidAdvancesSupplier(this.supplier)
        this.unpaidGrns = await DocumentService.GetUnpaidDocuments(this.supplier);
    }
}
</script>

<style>

</style>