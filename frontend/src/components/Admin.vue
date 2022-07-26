<template>
  <div>
      <v-main style="margin-top:0;padding-top:0">
        <v-container fluid ma-0 pa-0>
            <v-row>
                <v-col xs="12" sm="12" md="6" lg="6" xl="6">
                    <v-card>
                        <v-data-table :items="users" :headers="headers" item-key="_id" class="elevation-1">
                            <template v-slot:item.controls="{item}">
                                <div>
                                    <v-btn v-if="cuperm" @click="changePwd(item.id)"  icon > <v-icon>mdi-lock-alert</v-icon> </v-btn>
                                    <v-btn v-if="cuperm" @click="Remove(item.id)"  icon ><v-icon>mdi-delete</v-icon></v-btn>
                                    <v-btn v-if="puperm" @click="Permissions(item.id,item.username)"  icon> <v-icon>mdi-link-lock</v-icon> </v-btn>
                                </div>
                            </template>
                        </v-data-table>
                    </v-card>
                </v-col>
                <v-col xs="12" sm="6" md="6" lg="6" xl="6">
                    <v-card v-if="perm" style="margin-bottom:60px">
                        <v-card-title>Permissions {{permitter}}</v-card-title>
                        <v-expansion-panels>
                            <v-expansion-panel v-for="(permission,i) in categorizedPermissions" :key="i">
                                <v-expansion-panel-header>{{permission.category}}</v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <v-list>
                                        <v-list-item v-for="(item,j) in permission.items" :key="j">
                                            <v-list-item-content>
                                                <v-list-item-title>{{item.name}}</v-list-item-title>
                                                <v-list-item-subtitle>{{item.category}}</v-list-item-subtitle>
                                            </v-list-item-content>
                                            <v-list-item-action>
                                                <v-btn v-if="!item.is_given" @click="givePerm(item.id)" icon><v-icon>mdi-plus</v-icon></v-btn>
                                                <v-btn  v-if="item.is_given" @click="RemPer(item.id)" icon><v-icon>mdi-minus</v-icon></v-btn>
                                            </v-list-item-action>
                                        </v-list-item>
                                    </v-list>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
        
                        
        <v-btn v-if="cuperm" fab dark  @click="openNewUserDialog()" fixed right bottom>
            <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-dialog max-width="20rem" v-model="changep">
            <v-card style="padding:1rem">
                <v-card-title>Change Passowrd</v-card-title>
                <v-text-field type="password" v-model="changepass1" label="New Password"></v-text-field>
                <v-text-field type="password" v-model="changepass2" label="New Password(Again)"></v-text-field>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn  @click="changep = !changep" text>Cancel</v-btn>
                    <v-btn  @click="changePass()" dark>Change</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog max-width="20rem" v-model="dialog">
            <v-card style="padding:1rem">
                <v-card-title>New User</v-card-title>
                <v-text-field v-model="username" label="Username"></v-text-field>
                <v-text-field v-model="occupation" label="Occupation"></v-text-field>
                <v-text-field v-model="password1" type="password" label="Password"></v-text-field>
                <v-text-field v-model="password2" type="password" label="Password(Again)"></v-text-field>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn  @click="dialog = !dialog" text>Cancel</v-btn>
                    <v-btn @click="createUser()" dark>Create</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
          
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
      </v-main>
  </div>
</template>

<script>
import UserService from '../UserService';
import SettingService from '../SettingService';

export default {
    data() {
        return {
            users:[],
            permissions:[],
            changepassid:"",
            changepass1:"",
            changepass2:"",
            model:1,
            changep:false,
            categorizedPermissions:[],
            username:"",
            password1:"",
            password2:"",
            error:"",
            dialog:false,
            snackbar:false,
            timeout:3000,
            perm:false,
            ppusr:"",
            allprms:[],
            selectedperm:"",
            headers:[
                {
                    text:"",
                    value:"controls"
                },
                {
                    text:"Occupation",
                    value:"occupation"
                },
                {
                    text:"Name",
                    value:"username"
                }
            ],
            cuperm:false,
            permitter:'',
            puperm:false,
            occupation:'',
            given:[],
            notgiven:[],
        }
    },
    async created() {
        this.users = await UserService.GetAllUsers();
        
        this.permissions = await SettingService.getAllPermissions();
        var prm = await this.$store.state.permissions;
        for(var i = 0 ; i < prm.length ; i++){
            if(prm[i].permission == "User Permitting"){
                this.puperm = true;
            } 
            if(prm[i].permission == "User Creation"){
                this.cuperm = true;
            }
        }
        
    },
    methods: {
        openNewUserDialog(){
            this.dialog = true
        },
        async createUser(){
            //Here is create New User
            if(this.password1 == this.password2){
                await UserService.InsertUser(this.username,this.occupation,this.password1);
            }else{
                this.error = "passwords Not match";
                this.snackbar = true;
            }
            this.users = await UserService.GetAllUsers();
            this.error = "User Creation Success"
            this.snackbar = true
            this.username = "";
            this.password1 = "";
            this.password2 = "";
            this.dialog = false;
        },
        changePwd(idd){
            //change password by getting user data
            this.changepassid = idd;
            this.changep = true;
        },
        async changePass(){
            //change password with server
            if(this.changepass1 == this.changepass2){
                await UserService.ChangePassword(this.changepassid,this.changepass1);
                this.error = "Password Change Successs";
                this.snackbar = true;
            }else{
                this.error="passwords not match";
                this.snackbar = true;
            }
            this.changepass1 = "";
            this.changepass2 = "";
            this.changepassid = "";
            this.changep = false
        },
        async Remove(uid){
            var Mainusr = localStorage.getItem('UserToken')
            if(Mainusr != uid){
                 await UserService.RemoveUser(uid);
                 this.users = await UserService.GetAllUsers();
                 this.error = "Removed Success!"
                 this.snackbar = true
            }else{
                this.error = "You Cannot Remove Yourself!"
                this.snackbar = true
            }
           
        },
        async Permissions(uid,usr){
            this.ppusr = uid;
            this.perm = true;
            this.permitter = usr;
            this.PermissionDivider();
        },
        async PermissionDivider(){
            this.given.length = 0;
            this.notgiven.length = 0;
            this.allprms = await UserService.GetUserPermissionByID(this.ppusr);
            for(var i = 0 ; i < this.permissions.length ; i++){
                var success = false;
                for(var j = 0 ; j < this.allprms.length ; j++){
                    if(this.permissions[i].name == this.allprms[j].permission){
                        success  = true;
                        this.permissions[i].is_given = true;
                        break;
                    }
                }
                if(!success){
                    this.permissions[i].is_given = false;
                }
            }
            this.categorize_permissions()
        },
        categorize_permissions(){
            this.categorizedPermissions = []
            for(var i = 0 ; i < this.permissions.length ; i++){
                var success = false
                for(var j = 0 ; j < this.categorizedPermissions.length ; j++){
                    if(this.categorizedPermissions[j].category == this.permissions[i].category){
                        //add item to exists category
                        this.categorizedPermissions[j].items = this.categorizedPermissions[j].items.concat(this.permissions[i])
                        success = true;
                        break;
                    }
                }
                if(!success){
                    var model = {
                        category:this.permissions[i].category,
                        items:[this.permissions[i]]
                    }
                    this.categorizedPermissions = this.categorizedPermissions.concat(model);
                }
            }
        },
        async RemPer(perm){
            await UserService.RemovePermission(this.ppusr,perm);
            this.allprms = await UserService.GetUserPermissionByID(this.ppusr);
            this.PermissionDivider();
            this.error = "Removed Success"
            this.snackbar = true
        },
        async givePerm(permsi){
            await UserService.AddNewPermission(this.ppusr,permsi);
            this.allprms = await UserService.GetUserPermissionByID(this.ppusr);
            this.PermissionDivider();
            this.error = "Inserted Success"
            this.snackbar = true
            
        }
    },
}
</script>

<style>

</style>