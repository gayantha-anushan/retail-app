<template>
  <v-card>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-switch color="black" v-model="final_grn" inset label="Final GRN View"></v-switch>
      <v-btn @click="print_data()" text style="margin-left:1rem">Print</v-btn>
    </v-card-actions>
    <div id="printable" style="padding:10px;font-family: Arial, Helvetica, sans-serif;">
      <div style="font-family: Arial, Helvetica, sans-serif;">
        <div style="text-align:center;border-bottom:2px solid #000000">
          <h2>{{address.name}}</h2>
          <p><b>{{address.add1}},{{address.add2}},{{address.add3}}</b><br/>{{address.email}}<br/>{{address.tele}}
           <br> <b>Good Receive Note</b> </p>
        </div>
        <div style="display:flex;justify-content:space-between">
          <div style="margin-left:1rem">
            <p><b>System ID : {{grn_details.grn.id}}<br/>
            Reference : {{grn_details.grn.reference}}<br/>
            Received : </b>{{grn_details.grn.rec_date}}<br>
            <b>Entered : </b>{{grn_details.grn.ent_date}}<br/>
            <span v-if="grn_details.grn.orders != null"><b>Order : </b>{{grn_details.grn.orders}}<br/></span>
            <b>Invoice : </b>{{grn_details.grn.invoice}}</p>
          </div>
          <div v-if="grn_details.grn.st_id != null" style="margin-right:1rem">
            <p><b>Supplier ID:{{grn_details.grn.st_id}}<br/>
            Supplier: </b><span>{{grn_details.grn.st_name}}<br/>{{grn_details.grn.address1}}<br/>{{grn_details.grn.address2}}
            <br/>{{grn_details.grn.address3}}<br/>{{grn_details.grn.email}}<br/>{{grn_details.grn.telephone}}</span></p>
          </div>
        </div>
        <table  style="width:100%">
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
          <tr v-for="(item) in grn_details.items" :key="item.id">
            <td>{{item.code}}</td>
            <td>{{item.name}}</td>
            <td>{{item.unit}}</td>
            <td style="text-align:right">{{item.quantity}}</td>
            <td style="text-align:right">{{item.unit_price}}</td>
            <td style="text-align:right">{{item.total}}</td>
            <td style="text-align:right">{{item.discount}}</td>
            <td style="text-align:right">{{item.final}}</td>
          </tr>
          <tr>
            <td colspan="7">Total</td><td style="text-align:right">{{grn_details.grn.total}}</td>
          </tr>
          <tr>
            <td colspan="7">Discount ( {{grn_details.grn.discount}} ): </td><td style="text-align:right">{{grn_details.grn.disc_amount}}</td>
          </tr>
          <tr>
            <td colspan="7">VAT ( {{grn_details.grn.vat_percentage}} ): </td><td style="text-align:right">{{grn_details.grn.vat_amount}}</td>
          </tr>
          <tr>
            <td colspan="7">Final</td><td style="text-align:right">{{grn_details.grn.final}}</td>
          </tr>
        </table>
        <hr>
        <p><b>remarks : </b>{{grn_details.grn.remarks}}</p>
      </div>
      <hr>
    </div>
  </v-card>
</template>

<script>
import DocumentService from '../../../Document'

export default {
    props:['id'],
    data(){
      return {
        grn_details:null,
        final_grn:false,
        address:null
      }
    },
    watch:{
      'final_grn':function(){
        this.load_grn_data();
      },
      'id':function(){
        this.load_grn_data();
      }
    },
    methods:{
      async load_grn_data(){
        if(this.final_grn){
          this.grn_details = await DocumentService.GetFinalGrnAllData(this.id);
        }else{
          this.grn_details = await DocumentService.GetGrnAllData(this.id);
        }
      },
      async print_data(){
        await this.$htmlToPaper("printable")
      }
    },
    async created(){
      this.load_grn_data();
      this.address = {
          name:this.$store.getters.getName,
          add1:this.$store.getters.getAddress.add1,
          add2:this.$store.getters.getAddress.add2,
          add3:this.$store.getters.getAddress.add3,
          email:this.$store.getters.getEmail,
          tele:this.$store.getters.getTelephone
      }
    }
}
</script>

<style>
.hello{
  
}
</style>