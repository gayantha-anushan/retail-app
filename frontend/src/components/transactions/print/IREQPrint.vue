<template>
  <v-card>
    <v-card-actions>
      <v-spacer>
      </v-spacer>
      <v-btn text @click="print_document()">Print</v-btn>
    </v-card-actions>
    <div id="printable_doc">
       <div style="font-family: Arial, Helvetica, sans-serif;">
         <div style="text-align:center;border-bottom:2px solid #000000">
          <h2>{{address.name}}</h2>
          <p><b>{{address.add1}},{{address.add2}},{{address.add3}}</b><br/>{{address.email}}<br/>{{address.tele}}<br/>
          <b>Item Request Note</b> </p>
        </div>
        <div style="display:flex;justify-content:space-between">
          <div style="margin-left:1rem">
            <p><b>ID : {{allRequestData.id}} <br>
            Date : </b>{{allRequestData.reqdate}} <br>
            <b>Reference :</b> {{allRequestData.reference}} <br>
            <b>Customer Reference :</b> {{allRequestData.reference}}
            </p>
          </div>
          <div style="margin-right:1rem">
            <p><b>Customer ID : {{allRequestData.customer}} <br>
            Customer : </b> {{allRequestData.name}} <br>
            {{allRequestData.address1}} <br>
            {{allRequestData.address2}} <br>
            {{allRequestData.address3}} <br>
            {{allRequestData.email}} <br>
            {{allRequestData.telephone}} </p>
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
          <tr v-for="(item) in allRequestData.items" :key="item">
            <td>{{item.code}}</td>
            <td>{{item.name}}</td>
            <td>{{item.unit}}</td>
            <td style="text-align:right">{{item.unitprice}}</td>
            <td style="text-align:right">{{item.quantity}}</td>
            <td style="text-align:right">{{item.total}}</td>
            <td style="text-align:right">{{item.discount}}</td>
            <td style="text-align:right">{{item.final}}</td>
          </tr>
          <tr>
            <td colspan="7">Total</td>
            <td style="text-align:right">{{allRequestData.total}}</td>
          </tr>
          <tr>
            <td colspan="7">Discount</td>
            <td style="text-align:right">{{allRequestData.discount}}</td>
          </tr>
          <tr>
            <td colspan="7">Final</td>
            <td style="text-align:right">{{allRequestData.final}}</td>
          </tr>
        </table>
        <hr>
        <p>
          <b>Remarks : </b>{{allRequestData.remarks}}
        </p>
        <hr>
       </div>
    </div>
  </v-card>
</template>

<script>
import ItemReqService from '../../../ItemReqService'

export default {
    name:"IREQPrint",
    props:['id'],
    data(){
      return{
        allRequestData:null,
        address:null,
      }
    },
    watch:{
      'id':function(){
        this.load_item_request();
      }
    },
    methods:{
      async load_item_request(){
        this.allRequestData = await ItemReqService.getAllDataDocument(this.id);
      },
      async print_document(){
        this.$htmlToPaper("printable_doc")
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
      this.load_item_request();
    }
}
</script>

<style>

</style>