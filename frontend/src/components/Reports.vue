<template>
  <v-app>
    <v-app-bar app dark>
      <v-btn icon to="/dashboard">
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-toolbar-title>Reports</v-toolbar-title>
    </v-app-bar>
    <v-main>
    <v-tabs>
      <v-tab>Po List</v-tab>
      <v-tab>GRN List</v-tab>
      <v-tab>PRN List</v-tab>
      <v-tab>Item Request List</v-tab>
      <v-tab>Invoice List</v-tab>
      <v-tab>Invoice Return List</v-tab>
      <v-tab>Received Advances</v-tab>
      <v-tab>Paid Advances</v-tab>
      <v-tab>Stock Valuation Report</v-tab>
      <!-- <v-tab>Stock Aging Report</v-tab> -->
      <v-tab-item>
        <OrderChange/>
      </v-tab-item>
      <v-tab-item>
        <GrnChange/>
      </v-tab-item>
      <v-tab-item>
        <ChangeGren/>
      </v-tab-item>
      <v-tab-item>
        <ChangeRequest/>
      </v-tab-item>
      <v-tab-item>
        <ChangeInvoice/>
      </v-tab-item>
      <v-tab-item>
        <ChangeReturn/>
      </v-tab-item>
      <v-tab-item>
        <AdvanceList type="Customer" />
      </v-tab-item>
      <v-tab-item>
        <AdvanceList type="Suppliers" />
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-actions>
            <v-card-title>Stock Valuation Report</v-card-title>
            <v-spacer></v-spacer>
            <v-text-field v-model="search" label="Search"></v-text-field>
          </v-card-actions>
          <v-data-table
          :items="items"
          :headers="itemHeaders"
          :search="search"
          >
            <template v-slot:item.handler="{item}">
                <v-btn @click="show_bin(item.id)" icon>
                  <v-icon>mdi-file-document</v-icon>
                </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-tab-item>
      <!-- <v-tab-item>
        <v-card flat>
          <v-card-title>Stock Aging Report</v-card-title>
          <v-data-table></v-data-table>
        </v-card>
      </v-tab-item> -->
    </v-tabs>
    <v-dialog fullscreen v-model="bin_dialog" >
      <v-card>
        <v-toolbar dark>
          <v-btn @click="bin_dialog = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <BinCard :id="bin_id" />
      </v-card>
    </v-dialog>
    </v-main>
  </v-app>
</template>
<script>
import ReportService from '../ReportService'
import BinCard from './BinCard.vue'
import GrnChange from './GrnChange.vue'
import OrderChange from  './OrderChange.vue'
import ChangeGren from './ChangeGren.vue'
import ChangeRequest from './ChangeRequest.vue'
import ChangeInvoice from './ChangeInvoice.vue'
import ChangeReturn from './ChangeReturn.vue'
import AdvanceList from './payments/AdvanceList.vue'


export default {
  name:"Reports",
  components:{
    BinCard,
    OrderChange,
    AdvanceList,
    GrnChange,
    ChangeGren,
    ChangeRequest,
    ChangeInvoice,
    ChangeReturn
  },
  data(){
    return {
      search:'',
      items:[],
      itemHeaders:[
        {
          text:"",
          value:"handler"
        },
        {
          text:"ID",
          value:"id"
        },{
          text:"Code",
          value:"code"
        },{
          text:"Category",
          value:"category"
        },
        {
          text:"Type",
          value:"item_type"
        },{
          text:"Name",
          value:"name"
        },{
          text:"Unit",
          value:"unit"
        },{
          text:"Purchase Quantity",
          value:"purchases"
        },{
          text:"Sell Quantity",
          value:"sales"
        },{
          text:"Total Quantity",
          value:"quantity"
        },{
          text:"Unit Cost",
          value:"unit_cost"
        },{
          text:"Total Cost",
          value:"total_cost"
        },{
          text:"Average Unit Cost",
          value:"average_unit_cost"
        }
      ],
      bin_dialog:false,
      bin_id:null
    }
  },
  methods:{
    show_bin(id){
      this.bin_dialog = true
      this.bin_id = id
    }
  },
  async created(){
    this.items = await ReportService.getStockValuationReport();
  }
}
</script>

<style>

</style>