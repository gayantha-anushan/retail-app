<template>
    <v-card>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn dark @click="print_document()" style="margin-left:1rem">Print</v-btn>
        </v-card-actions>
        <div id="print_space">
            <div style="padding:10px;font-family: Arial, Helvetica, sans-serif;">
                 <div style="text-align:center;border-bottom:2px solid #000000">
                    <h2>{{address.name}}</h2>
                    <p><b>{{address.add1}},{{address.add2}},{{address.add3}}</b><br/>{{address.email}}<br/>{{address.tele}}
                    <br> <b>Purchase Order</b> </p>
                </div>
                <div style="display:flex;justify-content:space-between">
                    <div style="padding-left:1rem">
                        <p><b>System ID : {{purchase_order.id}} <br>
                        Reference : {{purchase_order.reference}} <br>
                        Requested :  </b>{{purchase_order.requested}} <br>
                        <b>Required : </b>{{purchase_order.required}}<br/></p>
                        <hr/>
                        <p><b>Type : </b>{{purchase_order.type}}
                        </p>
                    </div>
                    <div style="padding-right:1rem">
                        <p><b>Supplier ID : {{purchase_order.stake}} <br>
                        Supplier : </b>{{purchase_order.name}} <br>
                        {{purchase_order.name}} <br>
                        {{purchase_order.address1}} <br>
                        {{purchase_order.address2}} <br>
                        {{purchase_order.address3}} <br>
                        {{purchase_order.email}} <br>
                        {{purchase_order.telephone}} </p>
                    </div>
                </div>
                <hr>
                <table style="width:100%">
                    <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Unit</th>
                        <th>Unit Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Discount</th>
                        <th>Final</th>
                    </tr>
                    <tr v-for="(item) in purchase_order.items" :key="item.id">
                        <td>{{item.code}}</td>
                        <td>{{item.name}}</td>
                        <td>{{item.unit}}</td>
                        <td style="text-align:right" >{{item.unitprice}}</td>
                        <td style="text-align:right">{{item.quantitiy}}</td>
                        <td style="text-align:right">{{item.total}}</td>
                        <td style="text-align:right">{{item.discount}}</td>
                        <td style="text-align:right">{{item.final}}</td>
                    </tr>
                    <tr>
                        <td colspan="7">Total</td>
                        <td style="text-align:right">{{purchase_order.total}}</td>
                    </tr>
                    <tr>
                        <td colspan="7">Discount ( {{purchase_order.discount}} ): </td>
                        <td style="text-align:right">{{purchase_order.discount_am}}</td>
                    </tr>
                    <tr>
                        <td colspan="7">Tax ( {{purchase_order.vat_percentage}} ): </td>
                        <td style="text-align:right">{{purchase_order.vat_am}}</td>
                    </tr>
                    <tr>
                        <td colspan="7">Final</td>
                        <td style="text-align:right">{{purchase_order.final}}</td>
                    </tr>
                </table>
                <hr>
                <p><b>Remarks : </b>{{purchase_order.remarks}}<br/>
                <b>Payment Term : </b>{{purchase_order.payment_term}} <br>
                <b>Delivery Term : </b>{{purchase_order.delivery}} </p>
                <hr>
            </div>
        </div>
    </v-card>
</template>

<script>
import OrderService from '../../OrderService';

export default {
    name:"POPrint",
    props:['id'],
    data(){
        return{
            purchase_order:null,
            address:null,
            taxes:0,
        }
    },
    watch:{
        'id':function(){
            this.load_purchase_order();
        }
    },
    created(){
        console.log(this.id)
        this.load_purchase_order();
        this.address = {
          name:this.$store.getters.getName,
          add1:this.$store.getters.getAddress.add1,
          add2:this.$store.getters.getAddress.add2,
          add3:this.$store.getters.getAddress.add3,
          email:this.$store.getters.getEmail,
          tele:this.$store.getters.getTelephone
      }
    },
    methods:{
        async load_purchase_order(){
            this.purchase_order = await OrderService.GetCompletePO(this.id);
        },
        async print_document(){
            await this.$htmlToPaper("print_space")
        }
    }
}
</script>

<style>

</style>