<template>
  <v-conainer>
      <v-row>
          <v-col>
              <v-card>
                  <v-card-actions>
                      <v-card-title>Account</v-card-title>
                      <v-spacer></v-spacer>
                      <v-text-field label="search" v-model="search_acc"></v-text-field>
                      <v-btn dark small @click="add_acc_diag = true" fab style="margin-left:10px">
                          <v-icon>mdi-plus</v-icon>
                      </v-btn>
                  </v-card-actions>
                  <v-data-table
                  :search="search_acc"
                  :headers="acc_head"
                  :items="all_accounts"
                  >
                  <template v-slot:item.controls="{item}">
                      <v-btn @click="get_types(item.id)" icon>
                          <v-icon>mdi-filter-variant</v-icon>
                      </v-btn>
                  </template>
                  </v-data-table>
              </v-card>
          </v-col>
          <v-col>
              <v-card>
                  <v-card-actions>
                      <v-card-title>Transaction Types</v-card-title>
                      <v-spacer></v-spacer>
                      <v-text-field label="Search" v-model="type_search"></v-text-field>
                      <v-btn v-if="selected_acc != null" @click="add_type_diag = true" dark small fab style="margin-left:10px">
                          <v-icon>mdi-plus</v-icon>
                      </v-btn>
                  </v-card-actions>
                  <v-data-table
                  :search="type_search"
                  :headers="type_head"
                  :items="types"
                  ></v-data-table>
              </v-card>
          </v-col>
      </v-row>
       <v-dialog v-model="add_acc_diag" max-width="20rem">
           <v-card style="padding:1rem">
               <v-card-title>Add Account</v-card-title>
               <v-divider></v-divider>
               <v-text-field label="Code" v-model="new_acc_code"></v-text-field>
               <v-text-field label="Name" v-model="new_acc_name"></v-text-field>
               <v-card-actions>
                   <v-spacer></v-spacer>
                   <v-btn text @click="add_acc_diag = false">Cancel</v-btn>
                   <v-btn @click="create_account()" dark>Add</v-btn>
               </v-card-actions>
           </v-card>
       </v-dialog>
       <v-dialog max-width="20rem" v-model="add_type_diag">
           <v-card style="padding:1rem">
               <v-card-title>Add Type</v-card-title>
               <v-text-field label="name" v-model="new_type_name"></v-text-field>
               <v-card-actions>
                   <v-spacer></v-spacer>
                   <v-btn text @click="add_type_diag = false">Cancel</v-btn>
                   <v-btn dark @click="add_new_type()">Add</v-btn>
               </v-card-actions>
           </v-card>
       </v-dialog>
  </v-conainer>
 
</template>

<script>
import MainTransService from '../../MainTransService'

export default {
    name:"Create",
    data(){
        return {
            type_search:"",
            all_accounts:[],
            add_acc_diag:false,
            new_type_name:"",
            selected_acc:null,
            new_acc_code:"",
            add_type_diag:false,
            new_acc_name:"",
            search_acc:"",
            types:[],
            type_head:[
                {
                    text:"Name",
                    value:"name"
                }
            ],
            acc_head:[
                {
                    text:"",
                    value:"controls"
                },
                {
                    text:"ID",
                    value:"id"
                },
                {
                    text:"Code",
                    value:"code"
                },
                {
                    text:"Name",
                    value:"name"
                }
            ]
        }
    },
    methods:{
        async get_all_accounts(){
            this.all_accounts = await MainTransService.GetAllAccounts();
        },
        async create_account(){
            await MainTransService.AddAccount(this.new_acc_code,this.new_acc_name);
            this.get_all_accounts();
            this.new_acc_code = "";
            this.new_acc_name = "";
            this.add_acc_diag = false;
        },
        async get_types(id){
            this.selected_acc = id;
            this.types = await MainTransService.GetTypeByAccount(id);
        },
        async add_new_type(){
            await MainTransService.AddType(this.new_type_name,this.selected_acc)
            this.get_types(this.selected_acc);
            this.add_type_diag = false;
        }
    },
    created(){
        this.get_all_accounts();
    }
}
</script>