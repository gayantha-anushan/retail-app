<template>
  <v-card>
    <v-card-actions>
      <v-card-title>Purchase Return Notes</v-card-title>
      <v-spacer></v-spacer>
      <v-text-field label="Search" v-model="search_data"></v-text-field>
    </v-card-actions>
    <v-data-table
    :items='grenList'
    :headers="grenListHeaders"
    :search="search_data"
    >
      <template v-slot:item.controls="{item}">
        <v-btn @click="view_print_doc(item.id)" icon>
          <v-icon>mdi-file-document</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog v-model="print_gren_dialog" max-width="60rem">
      <v-card>
        <v-toolbar dark>
          <v-toolbar-title>GRN Return Note</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn @click="print_gren_dialog = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <GRENPrint :id="print_gren_id" />
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import ItemReturnService from '../ItemReturnService'
import GRENPrint from './transactions/print/GRENPrint.vue'

export default {
  name:"ChangeGren",
  components:{
    GRENPrint,
  },
  data(){
    return {
      grenList:[],
      print_gren_id:null,
      search_data:'',
      print_gren_dialog:false,
      grenListHeaders:[
        {
          text:"",
          value:"controls"
        },{
        text:"ID",
        value:"id"
      },{
        text:"Reference",
        value:"code"
      },{
        text:"Date",
        value:"date"
      },{
        text:"Returned Date",
        value:"returned_date"
      },{
        text:"GRN",
        value:"grn"
      },{
        text:"Total",
        value:"total"
      },{
        text:"Remarks",
        value:"remarks"
      }]
    }
  },
  methods:{
    view_print_doc(id){
      this.print_gren_id = id;
      this.print_gren_dialog = true
    }
  },
  async created(){
    this.grenList = await ItemReturnService.getAllGren();
  }
}
</script>

<style>

</style>