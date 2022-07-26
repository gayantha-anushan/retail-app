<template>
  <v-card style="padding:1rem">
      <!-- This is gren print view -->
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="print_document()" text>Print</v-btn>
      </v-card-actions>
      <div id="printable">
        <div style="font-family: Arial, Helvetica, sans-serif;">
          <div style="text-align:center;border-bottom:2px solid #000000">
            <h2>{{address.name}}</h2>
            <p><b>{{address.add1}},{{address.add2}},{{address.add3}}</b><br/>{{address.email}}<br/>{{address.tele}}<br/>
            <b>Purchase Return Note</b> </p>
          </div>
          <div style="display:flex;justify-content:space-between">
            <div style="margin-left:1rem">
              <p><b>ID : </b>{{all_datas.id}} <br>
              <b>Code : </b>{{all_datas.code}} <br>
              <b>Date Returned : </b>{{all_datas.returned_date}} <br> </p>
            </div>
            <div style="margin-right:1rem">
              <p> <b>GRN : </b>{{all_datas.grn}} <br>
              <b>Date : </b> {{all_datas.date}} </p>
            </div>
          </div>
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
            <tr
            v-for="(item) in all_datas.items"
            :key="item"
            >
              <td>{{item.code}}</td>
              <td>{{item.name}}</td>
              <td>{{item.unit}}</td>
              <td style="text-align:right">{{item.unit_price}}</td>
              <td style="text-align:right">{{item.quantity}}</td>
              <td style="text-align:right">{{item.total}}</td>
              <td style="text-align:right">{{item.discount}}</td>
              <td style="text-align:right">{{item.final}}</td>
            </tr>
            <tr>
              <td colspan="7">Total</td>
              <td style="text-align:right">{{all_datas.total}}</td>
            </tr>
            <tr>
              <td colspan="7">Discount ( {{all_datas.discount_percentage}} )  :</td>
              <td style="text-align:right">{{all_datas.discounted_amount}}</td>
            </tr>
            <tr>
              <td colspan="7">TAX Amount ( {{all_datas.vat_percentage}} ) :</td>
              <td style="text-align:right">{{all_datas.vat_amount}}</td>
            </tr>
            <tr>
              <td colspan="7">Final</td>
              <td style="text-align:right">{{all_datas.final}}</td>
            </tr>
          </table>
          <hr>
          <p><b>Remarks : </b>{{all_datas.remarks}}</p>
          <hr>
        </div>
      </div>
  </v-card>
</template>

<script>
import ItemReturnService from '../../../ItemReturnService';

export default {
    props:['id'],
    data(){
      return{
        all_datas:null,
        address:null
      }
    },
    methods:{
      async load_all_document(){
        this.all_datas = await ItemReturnService.GETCompleteGren(this.id);
      },
      async print_document(){
        this.$htmlToPaper("printable")
      }
    },
    created(){
      this.address = {
            name:this.$store.getters.getName,
            add1:this.$store.getters.getAddress.add1,
            add2:this.$store.getters.getAddress.add2,
            add3:this.$store.getters.getAddress.add3,
            email:this.$store.getters.getEmail,
            tele:this.$store.getters.getTelephone
        }
      this.load_all_document();
    },
    watch:{
      'id':function(){
        this.load_all_document();
      }
    }
}
</script>

<style>

</style>