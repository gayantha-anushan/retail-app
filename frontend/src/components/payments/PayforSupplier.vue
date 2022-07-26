<template>
  <v-card flat>
      <v-card-actions>
        <v-card-title>Pay For Suppliers</v-card-title>
        <v-spacer></v-spacer>
        <v-text-field label="Search" v-model="search_tag"></v-text-field>
      </v-card-actions>
      <v-data-table
      :search="search_tag"
      :items="all_stakes"
      :headers="all_stake_headers"
      >
      <template v-slot:item.controls="{item}">
        <v-btn @click="view_settlement_page(item.id)" icon>
          <v-icon>mdi-file-document</v-icon>
        </v-btn>
      </template>
      </v-data-table>
      <v-dialog v-model="settlement" fullscreen>
        <v-card>
          <v-toolbar dark>
            <v-toolbar-title>Settlement</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="settlement = false"><v-icon>mdi-close</v-icon></v-btn>
          </v-toolbar>
          <pfg :supplier="supplier_id"/>
        </v-card>
      </v-dialog>
  </v-card>
</template>

<script>
import PaymentService from '../../PaymentService'
import pfg from './Pfg.vue'

export default {
    components:{
      pfg
    },
    data(){
        return {
            search_tag:'',
            all_stakes:[],
            all_stake_headers:[
              {
                text:"",
                value:"controls"
              },
              {
                text:"ID",
                value:"id"
              },{
                text:"Name",
                value:"name"
              },{
                text:"E-mail",
                value:"email"
              },{
                text:"Telephone",
                value:"telephone"
              },{
                text:"Total Advance",
                value:"TotalAdvance"
              },{
                text:"Total GRN",
                value:"TotalGrn"
              },{
                text:"Total Return",
                value:"totalReturn"
              }
            ],
            supplier_id:null,
            settlement:false,
        }
    },
    methods:{
      view_settlement_page(id){
        this.supplier_id = id;
        this.settlement = true;
      }
    },
    async created(){
      this.all_stakes = await PaymentService.PendingPayments();
    }
}
</script>

<style>

</style>