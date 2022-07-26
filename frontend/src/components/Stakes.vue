<template>
  <div>
        <v-card style="padding:2rem;margin:2rem">
          <v-card-title>{{type}} List</v-card-title>
          <v-data-table
          :items="sellers"
          :headers="headers"
          item-key="name"
          class="elevation-1">
          <template v-slot:item.controls="{item}">
            <div>
              <v-btn v-if="editable && item.status == 'ACTIVE'" @click="Remove(item.id)" icon> <v-icon>mdi-close-octagon</v-icon> </v-btn>
              <v-btn v-if="editable && item.status == 'DEACTIVE'" @click="s_tart(item.id)" icon> <v-icon>mdi-check-circle</v-icon> </v-btn>
            </div>
          </template>
          <template v-slot:item.status="{item}">
            <div> 
              <v-chip label v-if="item.status == 'ACTIVE'">Active</v-chip>
              <v-chip label v-if="item.status == 'DEACTIVE'">Deactive</v-chip>
            </div>
          </template>
          </v-data-table> 
        </v-card>
        <v-dialog max-width="20rem" v-model="dialog">
          <v-card style="padding:1rem">
            <v-card-title>New {{type}}</v-card-title>
            <v-text-field v-model="name" label="Name"></v-text-field>
            <v-text-field v-model="address1" label="Address Line 1"></v-text-field>
            <v-text-field v-model="address2" label="Address Line 2"></v-text-field>
            <v-text-field v-model="address3" label="Address Line 3"></v-text-field>
            <v-text-field v-model="email" label="E-mail"></v-text-field>
            <v-text-field v-model="telephone" label="Telephone"></v-text-field>
            <v-card-actions>
              <v-btn color="primary" @click="dialog = !dialog" text>Cancel</v-btn>
              <v-btn color="primary" @click="insertStake()" dark>Create</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-btn fab v-if="editable" dark color="primary" @click="dialog = true" fixed right bottom>
          <v-icon>mdi-plus</v-icon>
        </v-btn>
    <v-snackbar v-model="snackbar" :timeout="timeout">
        {{error}}
        <template v-slot:action="{attrs}">
            <v-btn
            color="blue"
            text
            v-bind="attrs"
            @click="snackbar = false">Close</v-btn>
        </template>
    </v-snackbar>
  </div>
</template>

<script>
import StakeService from '../StakeService'

export default {
    name:"Stakes",
    props:['type'],
    data() {
      return {
        name:"",
        address1:"",
        address2:"",
        address3:"",
        dialog:false,
        snackbar:false,
        timeout:2000,
        error:"",
        email:"",
        telephone:"",
        sellers:[],
        singleSelect:true,
        selected:[],
        headers:[
          {
            text:"",
            value:"controls",
            sortable:false,
          },
          {
            text:'Name',
            sortable:false,
            value:'name'
          },
          {text:"Addressline1",value:"address1"},
          {text:"Addressline2",value:"address2"},
          {text:"Addressline3",value:"address3"},
          {text:"email",value:"email"},
          {text:"Telephone",value:"telephone"},
          {text:"Status",value:"status"}
        ],
        editable:false,
      }
    },
    async mounted() {
      //methods to implement
      this.sellers = await StakeService.GetAllStakes(this.type)
      this.$store.commit('checkpermissions',localStorage.getItem('UserToken'));
        var prm = await this.$store.state.permissions;
        for(var i = 0 ; i < prm.length ; i++){
            if(this.type == "Suppliers" && prm[i].permission == "Change Suppliers"){
                this.editable = true
            }
            if(this.type == "Customer" && prm[i].permission == "Change Customers"){
                this.editable = true
            }
        }
    },
    methods: {
      //add another methods
      async insertStake(){
        await StakeService.InsertNewStake(this.name,this.address1,this.address2,this.address3,this.email,this.telephone,this.type)
        this.name = ""
        this.address1 = ""
        this.address2 = ""
        this.address3 = ""
        this.email = ""
        this.telephone = ""
        this.dialog = false;
        this.sellers = await StakeService.GetAllStakes(this.type)
        this.error = "Success Insertion"
        this.snackbar = true;
      },
      async s_tart(id){
        await StakeService.StartStake(id)
        this.sellers = await StakeService.GetAllStakes(this.type)
      },
      async Remove(id){
        await StakeService.RemoveStake(id)
        this.sellers = await StakeService.GetAllStakes(this.type)
      }
    },
}
</script>

<style>

</style>