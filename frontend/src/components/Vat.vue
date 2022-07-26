<template>
 <div>
     <v-data-table
     :items="allVats"
     :headers="headers"
     item-key="_id"
     >
        <template v-slot:item.controls="{item}">
            <div>
                <v-btn  @click="deleteVat(item.id)" v-if="item.active == 1" icon ><v-icon>mdi-close-octagon</v-icon></v-btn>
                 <v-btn  @click="start_vat(item.id)" icon v-if="item.active == 0" ><v-icon>mdi-check-circle</v-icon></v-btn>
            </div>
        </template>
        <template v-slot:item.status="{item}">
            <div>
                <v-chip v-if="item.active == 1" label>Active</v-chip>
                <v-chip v-if="item.active == 0" label>Deactive</v-chip>
            </div>
        </template>
     </v-data-table>
    <v-btn fixed @click="addVat = true" right fab bottom color="primary" dark >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-dialog max-width="30rem" v-model="addVat">
        <v-card style="padding:1rem">
            <v-select
            :items="invoices"
            v-model="invoiceType"
            label="Invoice Type"></v-select>
            <v-text-field v-model="invName" label="Name"></v-text-field>
            <v-text-field v-model="percent" label="Percentage"></v-text-field>
            <v-select
            v-model="actio"
            :items="action"
            label="Action"></v-select>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="addVat = false" text>Cancel</v-btn>
                <v-btn color="primary" @click="addNewVat()" dark>Add</v-btn>
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
  </div>
</template>

<script>
import InvoiceService from '../InvoiceService'

export default {
    name:'Vat',
    data() {
        return {
            addVat:false,
            invoices:['nvat','vat','svat'],
            action:['Calculate','Nothing'],
            allVats:[],
            headers:[
                {
                    text:"",
                    value:"controls"
                },
                {
                    text:'Name',
                    value:'name'
                },{
                    text:"Invoice",
                    value:"invoice"
                },{
                    text:"Percentage",
                    value:"percentage"
                },{
                    text:"Action",
                    value:"action"
                },{
                    text:"Status",
                    value:"status"
                }
            ],
            invoiceType:'',
            invName:'',
            percent:'',
            actio:'',
            snackbar:false,
            timeout:2000,
            error:'',
            selectedVats:[],
        }
    },
    async created() {
        this.allVats = await InvoiceService.ViewAllVats();
    },
    methods: {
        async addNewVat(){
            await InvoiceService.CreateVat(this.invoiceType,this.invName,this.percent,this.actio);
            this.invName = "";
            this.percent = "";
            this.addVat = false;
            this.error = "Success!"
            this.snackbar = true;
             this.allVats = await InvoiceService.ViewAllVats();
        },
        async start_vat(id){
            await InvoiceService.startVatAgain(id)
            this.allVats = await InvoiceService.ViewAllVats();
        },
        async deleteVat(id){
            await InvoiceService.DeleteVat(id);
            this.selectedVats = []
            this.error = "Success!";
            this.snackbar = true;
            this.allVats = await InvoiceService.ViewAllVats();
        }
    },
}
</script>

<style>

</style>