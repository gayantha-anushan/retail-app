<template>
      <v-card style="padding:1rem">
          <v-card-actions>
             <v-spacer></v-spacer>
             <v-switch color="black" v-model="view_type" inset label="Final Invoice View"></v-switch>&nbsp;
             <v-btn @click="print()" dark style="margin-left:1rem"  >Print</v-btn>
         </v-card-actions>
         <div id="printable" style="font-family: Arial, Helvetica, sans-serif;margin:0;padding:0">
              <div style="font-family: Arial, Helvetica, sans-serif;">
                  <div style="text-align:center;border-bottom:2px solid #000000">
                <h2>{{address.name}}</h2>
                <p><b>{{address.add1}},{{address.add2}},{{address.add3}}</b><br/>{{address.email}}<br/>{{address.tele}}</p>
                <p><b>{{name}}</b></p>
            </div>
            <div style="display:flex;justify-content:space-between">
                <div style="margin-left:1rem">
                    <b>ID : INV-{{invComplete.id}} <br>
                    Date : </b>{{invComplete.date}} <br>
                    <hr>
                    <b>Order : </b>{{invComplete.prevdoc}} <br>
                </div>
                <div style="margin-right:1rem" v-if="invComplete.customer != null">
                    <b>Customer ID : {{customer.id}}<br>
                    Customer :</b> {{customer.name}} <br>
                    {{customer.address1}}<br>
                    {{customer.address2}}<br>
                    {{customer.address3}}<br/>
                    {{customer.email}}<br/>
                    {{customer.telephone}}
                </div>
            </div>
            <hr>
            <table style="width:100%">
                <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Unit</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                    <th>Discount</th>
                    <th>Final</th>
                </tr>
                <tr v-for="(item) in invData" :key="item.id">
                    <td>{{item.code}}</td>
                    <td>{{item.name}}</td>
                    <td>{{item.unit}}</td>
                    <td style="text-align:right">{{item.quantity}}</td>
                    <td style="text-align:right">{{item.unit_price}}</td>
                    <td >{{item.total}}</td>
                    <td>{{item.discount}}</td>
                    <td>{{item.final}}</td>
                </tr>
                <tr>
                    <td colspan="7">Total</td>
                    <td>{{invComplete.total}}</td>
                </tr>
                <tr>
                    <td colspan="8">
                        <p v-for="(tax) in cvat" :key="tax">{{tax.name}} : {{tax.percentage}}</p>
                    </td>
                </tr>
                <tr>
                    <td colspan="7">
                        Final Amount(Tax and discount also included)
                    </td>
                    <td>{{invComplete.final}}</td>
                </tr>
            </table>
            <hr>
            <b>Remarks : </b>{{invComplete.remarks}}
            <hr>
              </div>
         </div>
      </v-card>
</template>

<script>
import InvoiceService from '../../../InvoiceService'
import StakeService from '../../../StakeService'

export default {
    props:['invoice'],
    data() {
        return {
            invData:null,
            invComplete:null,
            address:null,
            ncVat:[],
            view_type:false,
            cvat:[],
            name:'',
            customer:null,
        }
    },
    methods: {
        async print(){
            await this.$htmlToPaper("printable")
        },

        calcVats(discount,total){
            // var dt = disc.split('%');
            // var x = Number(dt[0]);
            // return x;

            if(discount == ""){
            return 0;
            }else{
                if(discount.indexOf("%") > -1){
                var m = discount.split("%")
                var x = Number(m[0])
                return total*(x /100);
                }else{
                var xi = Number(discount)
                return xi;
                }
            }
        },
        async load_invoice(){
            var allvats = []
            if(this.view_type){
                var invoice_data = await InvoiceService.ViewAllFinalInvoiceDetails(this.invoice)
                this.invComplete = invoice_data.invoice
                this.invData = invoice_data.items
                allvats = invoice_data.vats
            }else{
                var invoice_data_2 = await InvoiceService.ViewAllInvoiceDetails(this.invoice) 
                this.invComplete = invoice_data_2.invoice
                this.invData = invoice_data_2.items
                allvats = invoice_data_2.vats
            }

            if(this.invComplete.customer != null){
                this.customer = await StakeService.getStakeFromID(this.invComplete.customer);
            }

            this.ncVat = [];
            this.cvat = [];
            for(var i = 0 ; i < allvats.length ; i++){
                var vt = allvats[i];
                if(vt.action == "Nothing"){
                    this.ncVat = this.ncVat.concat(vt);
                }else{
                    this.cvat = this.cvat.concat(vt);
                }
            }
            if(this.invComplete.type == "nvat"){
                this.name = "Invoice"
            }
            if(this.invComplete.type == "vat"){
                this.name = "VAT Invoice"
            }
            if(this.invComplete.type == "svat"){
                this.name = "SVAT Invoice"
            }
        }
    },
    watch:{
        'view_type':function(){
            this.load_invoice();
        },
        'invoice':function(){
            this.load_invoice();
        }
    },
    async created() {
        this.address = {
            name:this.$store.getters.getName,
            add1:this.$store.getters.getAddress.add1,
            add2:this.$store.getters.getAddress.add2,
            add3:this.$store.getters.getAddress.add3,
            email:this.$store.getters.getEmail,
            tele:this.$store.getters.getTelephone
        }
        this.load_invoice();
    },
}
</script>
