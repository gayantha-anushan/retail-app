<template>
  <v-card flat>
      <v-data-table
      :items="data_list"
      :headers="data_headers"
      ></v-data-table>
  </v-card>
</template>

<script>
import ReportService from '../ReportService'

export default {
    name:"BinCard",
    props:['id'],
    data(){
        return{
            data_list:[],
            data_headers:[
                {
                    text:"Date",
                    value:"date"
                },{
                    text:"Purchase Qty",
                    value:"in_quantity"
                },{
                    text:"purchase Unit Price",
                    value:"in_up"
                },{
                    text:"Total Purchases",
                    value:"in_total"
                },{
                    text:"Sell Qty",
                    value:"out_quantity"
                },{
                    text:"Sell Unit Price",
                    value:"out_up"
                },{
                    text:"Total Sells",
                    value:"out_total"
                },{
                    text:"Total qty",
                    value:"total_qty"
                },{
                    text:"Total Cost",
                    value:"total_cost"
                },{
                    text:"Average Unit Cost",
                    value:"avg_up"
                }
            ]
        }
    },
    watch:{
        'id':async function(){
            this.data_list = await ReportService.GETBinCard(this.id)
        }
    },
    async created(){
        this.data_list = await ReportService.GETBinCard(this.id)
    }
}
</script>

<style>

</style>