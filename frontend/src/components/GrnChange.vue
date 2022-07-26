<template>
  <v-card>
    <v-card-actions>
      <v-card-title>Good Receive Note</v-card-title>
      <v-spacer></v-spacer>
      <v-text-field label="Search"  v-model="searchGrn"></v-text-field>
    </v-card-actions>
    <v-data-table
    :items="allGrns"
    :headers="GrnHeaders"
    :search="searchGrn"
    >
      <template v-slot:item.controls="{item}">
        <v-btn icon @click="view_grn(item.id)">
          <v-icon >mdi-file-document</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog max-width="60rem" v-model="print_grn_dialog">
      <v-card>
        <v-toolbar dark>
          <v-toolbar-title>Good Receive Note</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn @click="print_grn_dialog = false" icon>
            <v-icon >mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <GRNPrint :id="print_grn_id" />
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import DocumentService from '../Document'
import GRNPrint from './transactions/print/GRNPrint.vue'

export default {
  components:{
    GRNPrint
  },
  data() {
    return {
      searchGrn:"",
      allGrns:[],
      GrnHeaders:[
        {
          text:"",
          value:"controls"
        },
        {
          text:"ID",
          value:"id"
        },{
          text:"Reference",
          value:"reference"
        },{
          text:"Supplier",
          value:"name"
        },
        {
          text:"Received Date",
          value:"rec_date"
        },
        {
          text:"Entered Date",
          value:"ent_date"
        },
        {
          text:"Purchase Order",
          value:"orders"
        },
        {
          text:"Invoice",
          value:"invoice"
        },
        {
          text:"Total",
          value:"total"
        },{
          text:"Final",
          value:"final"
        },
        {
          text:"Paid",
          value:"paid"
        }
      ],
      print_grn_id:null,
      print_grn_dialog:false,
    }
  },
  async created() {
    //loading event
    this.allGrns = await DocumentService.GetAllDocuments();
  },
  methods: {
    view_grn(id){
      this.print_grn_id = id;
      this.print_grn_dialog = true;
    }
  },
}
</script>

<style>

</style>