<template>
  <v-card>
    <v-card-actions>
      <v-card-title>Item Return Note</v-card-title>
      <v-spacer></v-spacer>
      <v-text-field label="search" v-model="searched"></v-text-field>
    </v-card-actions>
    <v-data-table
      :items="AllReturnNotes"
      :headers="allItemHeaders"
      :search="searched">
      <template v-slot:item.controls="{item}">
        <v-btn icon @click="view_return_document(item.id)">
          <v-icon>mdi-file-document</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog v-model="print_dialog" max-width="60rem">
      <v-card>
        <v-toolbar>
          <v-toolbar-title>Item Return Note</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="print_dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <ItemReturnPrint :id="print_id" />
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import ItemReturnService from '../ItemReturnService'
import ItemReturnPrint from './transactions/print/ItemReturnPrint.vue'

export default {
  name:"ChangeReturn",
  components:{
    ItemReturnPrint
  },
  data() {
    return {
      print_dialog:false,
      print_id:null,
      AllReturnNotes:[],
      searched:'',
      allItemHeaders:[
        {
          text:"",
          value:"controls"
        },
        {
          text:"ID",
          value:"id"
        },{
          text:"Returned Date",
          value:"return_date"
        },{
          text:"Reference",
          value:"reference"
        },
        {
          text:"invoice ID",
          value:"invoice"
        },{
          text:"Amount",
          value:"returned_amount"
        }
      ]
    }
  },
  methods: {
    view_return_document(id){
      this.print_id = id;
      this.print_dialog = true;
    }
  },
  async created() {
    this.AllReturnNotes = await ItemReturnService.GetAllReturnNotes();
  },
}
</script>

<style>

</style>