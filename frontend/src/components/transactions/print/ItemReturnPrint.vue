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
          <b>Item Return Note</b> </p>
        </div>
        <div style="display:flex;justify-content:space-between">
          <div style="margin-left:1rem">
            <p><b>ID : </b>{{all_datas.id}} <br>
            <b>Reference : </b> {{all_datas.reference}} <br>
            <b>Returned Date : </b>{{all_datas.return_date}}</p>
          </div>
          <div style="margin-right:1rem">
            <p><b>Invoice : </b>{{all_datas.invoice}} <br>
            <b>Date : </b> {{all_datas.date}} </p>
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
              <td style="text-align:right">{{all_datas.returned_amount}}</td>
            </tr>
          </table>
        <hr>
        <p><b>Remarks : </b>{{all_datas.reason}}</p>
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
        this.all_datas = await ItemReturnService.GETCompleteIret(this.id);
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