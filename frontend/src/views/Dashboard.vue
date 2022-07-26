<template>
    <v-app>
        <v-app-bar app dark>
            <v-toolbar-title @click="changes(1)">{{username}}</v-toolbar-title>
            <v-menu style="margin-left:1rem;margin-right:1rem" offset-y>
                <template v-slot:activator="{on,attrs}">
                    <v-btn
                    style="margin-left:1rem;margin-right:1rem"
                    icon
                    v-bind="attrs"
                    v-on="on">
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item v-if="vi" :to="{name:'Add',params:{selection:'Items'}}" >
                        <v-list-item-title>Items</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="vs" :to="{name:'Add',params:{selection:'Suppliers'}}">
                        <v-list-item-title >Suppliers</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="vc" :to="{name:'Add',params:{selection:'Customers'}}" >
                        <v-list-item-title>Customers</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="vat" :to="{name:'Add',params:{selection:'VAT'}}" >
                        <v-list-item-title>VAT</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="pettyCash" :to="{name:'Add',params:{selection:'Petty Cash'}}" >
                        <v-list-item-title>Petty Cash</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="mainCash" :to="{name:'Add',params:{selection:'Main Expenses'}}" >
                        <v-list-item-title>Main Expenses</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
            <v-menu style="margin-left:1rem;margin-right:1rem" offset-y>
                <template v-slot:activator="{on,attrs}">
                    <v-btn
                    style="margin-left:1rem;margin-right:1rem"
                    icon
                    v-bind="attrs"
                    v-on="on">
                      <v-icon>mdi-shopping</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item v-if="epo" :to="{name:'Transactions',params:{docutype:'PO'}}">
                        <v-list-item-title>Purchase Order</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="egrn" :to="{name:'Transactions',params:{docutype:'GRN'}}">
                        <v-list-item-title >Good Receive Notes</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="egren" :to="{name:'Transactions',params:{docutype:'GREN'}}">
                        <v-list-item-title >Purchase Return Note</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
            <v-menu style="margin-left:1rem;margin-right:1rem" offset-y>
                <template v-slot:activator="{on,attrs}">
                    <v-btn
                    style="margin-left:1rem;margin-right:1rem"
                    icon
                    v-bind="attrs"
                    v-on="on">
                      <v-icon>mdi-cart</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item v-if="einv" :to="{name:'Transactions',params:{docutype:'INV'}}">
                        <v-list-item-title>Invoice</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="eord" :to="{name:'Transactions',params:{docutype:'MRN'}}">
                        <v-list-item-title>Item Request</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="eirn" :to="{name:'Transactions',params:{docutype:'MREN'}}">
                        <v-list-item-title>Invoice Return</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
            <v-tooltip v-if="pay_perm"  bottom>
                <template v-slot:activator="{ on , attrs }">
                    <v-btn style="margin-left:1rem;margin-right:1rem" v-bind="attrs" v-on="on" @click="changes(12)" icon><v-icon>mdi-cash-check</v-icon></v-btn>
                </template>
                <span>Payments</span>
            </v-tooltip>
            <v-tooltip v-if="stc_perm"  bottom>
                <template v-slot:activator="{ on , attrs }">
                    <v-btn style="margin-left:1rem;margin-right:1rem" v-bind="attrs" v-on="on" to="/str" icon><v-icon>mdi-file-chart</v-icon></v-btn>
                </template>
                <span>Stock Report Document</span>
            </v-tooltip>
            <v-tooltip v-if="reportPerm"  bottom>
                <template v-slot:activator="{ on , attrs }">
                    <v-btn style="margin-left:1rem;margin-right:1rem" v-bind="attrs" v-on="on" to="/reports" icon><v-icon>mdi-chart-multiline</v-icon></v-btn>
                </template>
                <span>Reports</span>
            </v-tooltip>
            
            <v-tooltip v-if="settingbtn" bottom>
                <template v-slot:activator="{ on , attrs }">
                    <v-btn style="margin-left:1rem;margin-right:1rem" v-bind="attrs" v-on="on" @click="settings()" icon><v-icon>mdi-cog</v-icon></v-btn>
                </template>
                <span>Settings</span>
            </v-tooltip>
            <v-tooltip v-if="pettyCashn"  bottom>
                <template v-slot:activator="{ on , attrs }">
                    <v-btn style="margin-left:1rem;margin-right:1rem" v-bind="attrs" v-on="on" to="/pettycash" icon><v-icon>mdi-notebook</v-icon></v-btn>
                </template>
                <span>Petty Cash</span>
            </v-tooltip>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
                <template v-slot:activator="{ on , attrs }">
                    <v-btn style="margin-left:1rem;margin-right:1rem" v-bind="attrs" v-on="on" @click="logout()" icon><v-icon>mdi-exit-to-app</v-icon></v-btn>
                </template>
                <span>Logout</span>
            </v-tooltip>
        </v-app-bar>
        <v-main v-if="dash">
            <v-alert
            outlined
            type="warning"
            prominent
            border="left"
            style="margin:1rem"
            v-if="changeUser">
            Create new Account for Administrate and Remove Admin Account from your system.
            </v-alert>
            <v-card style="margin:5rem">
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-avatar color="grey" large>
                        <v-icon dark>mdi-account-circle</v-icon>
                    </v-avatar>
                    <v-spacer></v-spacer>
                </v-card-actions>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-card-title>{{username}}</v-card-title>
                    <v-spacer></v-spacer>
                </v-card-actions>
                 <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-card-subtitle v-if="occupation != null">{{occupation}}</v-card-subtitle>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-main>
        <v-main v-if="advance"><Payments/></v-main>
    </v-app>
</template>

<script>
import Payments from '../components/payments/Payments.vue'
import UserService from '../UserService';

export default {
    components:{
        Payments,
    },
    async created() {
        this.userid = localStorage.getItem('UserToken')
        this.occupation = localStorage.getItem('occupation');
        this.username = localStorage.getItem('username')
        if(localStorage.getItem('UserToken') == null){
            this.$router.push('/')
        }
        if(this.$store.getters.getName == null){
            await this.$store.commit("updateSettings")
        }
        var prm = await this.$store.state.permissions;
        if(prm.length == 0 ){
            this.$store.commit('checkpermissions',localStorage.getItem('UserToken'));
            prm = await this.$store.state.permissions;
        }
        for(var i = 0 ; i < prm.length ; i++){
            if(prm[i].permission == "Main Settings" || prm[i].permission == "User Creation" || prm[i].permission == "User Permitting" || prm[i].permission == "Excel Upload"){
                this.settingbtn = true;
            }
            if(prm[i].permission == "View Items"){
                this.vi = true
            }
            if(prm[i].permission == "View Suppliers"){
                this.vs = true;
            }
            if(prm[i].permission == "View Customers"){
                this.vc = true;
            }
            if(prm[i].permission == "View VAT" || prm[i].permission == "Change VAT"){
                this.vat = true;
            }
            if(prm[i].permission == "View VAT" || prm[i].permission == "Change VAT"){
                this.vat = true;
            }
            if(prm[i].permission == "Edit PO"){
                this.epo = true;
            }
            if(prm[i].permission == "Edit GRN"){
                this.egrn = true;
            }
            if(prm[i].permission == "Edit GREN"){
                this.egren = true;
            }
            if(prm[i].permission == "Edit Order"){
                this.eord = true;
            }
            if(prm[i].permission == "Edit Invoice"){
                this.einv = true;
            }
            if(prm[i].permission == "Edit IRN"){
                this.eirn = true;
            }
            if(prm[i].permission == "Petty Administrate"){
                this.pettyCash = true;
            }
            if(prm[i].permission == "Petty View"||prm[i].permission == "Petty Expense" || prm[i].permission == "Petty Set Off"){
                this.pettyCashn = true;
            }
            if(prm[i].permission == "Main Administrate"){
                this.mainCash = true;
            }
            if(prm[i].permission == "View PO" || prm[i].permission == "View GRN" || prm[i].permission == "View GREN" || prm[i].permission == "View Order" || prm[i].permission == "View Invoice" || prm[i].permission == "View IRN" || prm[i].permission == "Stock Valuation Report"){
                this.reportPerm = true;
            }
            if(prm[i].permission == "Recipt" || prm[i].permission == "Payment" || prm[i].permission == "Supplier Set Off"){
                this.pay_perm = true;
            }
            if(prm[i].permission == "Create STC" || prm[i].permission == "Print STC" || prm[i].permission == "Edit STC" || prm[i].permission == "History STC"){
                this.stc_perm = true;
            }
            //||prm[i].permission == "Main View"||prm[i].permission == "Main Expense" || prm[i].permission == "Main Set Off"
        }
        if(this.username == "Admin"){
            this.changeUser = true
        }
    },
    data() {
        return {
            pettyCash:false,
            pettyCashn:false,
            reportPerm:false,
            stc_perm:false,
            pay_perm:false,
            mainCash:false,
            eord:false,
            einv:false,
            eirn:false,
            epo:false,
            egrn:false,
            egren:false,
            change_gren:false,
            occupation:'',
            trdes:true,
            settingbtn:false,
            userid:"",
            username:"",
            dash:true,
            changeUser:false,
            advance:false,
            vi:false,
            vs:false,
            vc:false,
            vat:false,
        }
    },
    methods: {
        settings(){
            this.$router.replace({name:'Settings',params:{user:this.userid}})
        },
        logout(){
            try{
                UserService.Logout(localStorage.getItem('UserToken'))
            }catch(error){
                // console.log("Logging Out Error Occured!")
            }
            localStorage.clear();
            this.$router.push('/');
        },
        hide(){
            this.dash = false;
            this.advance = false;
        },
        changes(val){
            switch(val){
                case 1:
                    this.hide();
                    this.dash = true;
                    break;
                case 12:
                    this.hide();
                    this.advance = true;
                    break;
            }
        }
    }
}
</script>

<style>

</style>