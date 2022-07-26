<template>
  <v-app>
      <v-app-bar app  dark>
          <v-btn to="/dashboard" icon><v-icon>mdi-home</v-icon></v-btn>
          <v-toolbar-title>Settings</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-switch v-if="this.msPerm" @change="updateChange()" v-model="transactive" inset label="Statue"></v-switch>
      </v-app-bar>
      <v-main>
          <v-tabs>
              <v-tab v-if="excel">Excel Upload</v-tab>
              <v-tab-item v-if="excel">
                  <ExcelUpload />
              </v-tab-item>
              <v-tab v-if="this.msPerm">SysTem Settings</v-tab>
              <v-tab-item v-if="this.msPerm">
                  <v-card  style="padding:2rem;margin:2rem">
                    <v-card-title>Place Your Company Data Here</v-card-title>
                    <v-progress-linear v-if="loading" indeterminate dark></v-progress-linear>
                    <v-form>
                        <v-text-field v-model="c_name" label="Company Name"></v-text-field>
                        <v-text-field v-model="c_add1" label="Addressline 1"></v-text-field>
                        <v-text-field v-model="c_add2" label="Addressline 2"></v-text-field>
                        <v-text-field v-model="c_add3" label="Addressline 3"></v-text-field>
                        <v-text-field v-model="c_email" label="E-mail"></v-text-field>
                        <v-text-field v-model="c_tele" label="Telephone"></v-text-field>
                    </v-form>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-progress-circular indeterminate v-if="changing" style="margin:1rem"></v-progress-circular>
                        <v-btn  @click="changeData()" dark>Change</v-btn>
                    </v-card-actions>
                </v-card>
              </v-tab-item>
              <v-tab v-if="userPerm">User Settings</v-tab>
              <v-tab-item v-if="userPerm">
                  <Admin/>
              </v-tab-item>
          </v-tabs>
          <v-snackbar v-model="snackbar" :timeout="2000">{{error}}
              <template v-slot:action="{ attrs }">
                  <v-btn
                  color="blue"
                  text
                  v-bind="attrs"
                  @click="snackbar = false">Close</v-btn>
              </template>
          </v-snackbar>
      </v-main>
  </v-app>
</template>

<script>
import SettingService from '../SettingService'
import Admin from '../components/Admin.vue'
import ExcelUpload from './ExcelUpload.vue';

export default {
    name:"Settings",
    components:{
        Admin,
        ExcelUpload
    },
    props:['user'],
    data() {
        return {
            transactive:false,
            c_name:"",
            c_add1:"",
            c_add2:"",
            c_add3:"",
            c_email:"",
            c_tele:"",
            snackbar:false,
            excel:false,
            error:"",
            msPerm:false,
            userPerm:false,
            loading:true,
            changing:false,
        }
    },

    async created() {
        if(localStorage.getItem('UserToken') == null){
            this.$router.push('/')
        }
        this.$store.commit('checkpermissions',localStorage.getItem('UserToken'));
        var prm = await this.$store.state.permissions;
        for(var i = 0 ; i < prm.length ; i++){
            if(prm[i].permission == "Main Settings"){
                this.msPerm = true
            }
            if(prm[i].permission == "Excel Upload"){
                this.excel = true
            } 
            if(prm[i].permission == "User Creation" || prm[i].permission == "User Permitting"){
                this.userPerm = true
            }
        }
        var ss = await SettingService.getSetting("active");
        if(ss[0].status == "yes"){
            this.transactive = true
        }else{
            this.transactive = false
        }
        if(this.$store.getters.getName == null){
            await this.$store.commit("updateSettings")
        }
        this.c_name = this.$store.getters.getName;
        this.c_add1 = this.$store.getters.getAddress.add1;
        this.c_add2 = this.$store.getters.getAddress.add2;
        this.c_add3 = this.$store.getters.getAddress.add3;
        this.c_email = this.$store.getters.getEmail;
        this.c_tele = this.$store.getters.getTelephone;
        
        this.loading = false;
    },
    methods: {
        async updateChange(){
            var x = ""
            if(this.transactive){
                x = "yes"
            }else{
                x = "no"
            }
            await SettingService.updateSetting("active",x);
            var ss = await SettingService.getSetting("active");
            if(ss[0].status == "yes"){
                this.transactive = true
            }else{
                this.transactive = false
            }
            this.error = "Transaction Status Changed"
            this.snackbar = true;
        },
        async changeData(){
            this.changing = true;
            if(this.c_name != this.$store.getters.getName){
                await SettingService.updateSetting("company_name",this.c_name)
            }
            if(this.c_add1 != this.$store.getters.getAddress.add1){
                await SettingService.updateSetting("address1",this.c_add1)
            }
            if(this.c_add2 != this.$store.getters.getAddress.add2){
                await SettingService.updateSetting("address2",this.c_add2)
            }
            if(this.c_add3 != this.$store.getters.getAddress.add3){
                await SettingService.updateSetting("address3",this.c_add3)
            }
            if(this.c_email != this.$store.getters.getEmail){
                await SettingService.updateSetting("email",this.c_email)
            }
            if(this.c_tele != this.$store.getters.getTelephone){
                await SettingService.updateSetting("tele",this.c_tele)
            }
            
            await this.$store.commit("updateSettings")

            this.changing = false;

            this.error = "Updates Done Success"
            this.snackbar = true
        }
    },
}
</script>

<style>

</style>