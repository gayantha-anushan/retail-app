<template>
  <v-card flat>
      <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="print()" dark>Print</v-btn>
      </v-card-actions>
      <div id="printable">
          <h2 style="font-family: Arial, Helvetica, sans-serif">Petty Cash Report</h2>
          <table style="width:100%;border:1px solid black; border-collapse:collapse;font-family: Arial, Helvetica, sans-serif" >
              <tr style="border:1px solid black; border-collapse:collapse">
                  <th style="border:1px solid black; border-collapse:collapse">ID</th>
                  <th style="border:1px solid black; border-collapse:collapse">Transaction Type</th>
                  <th style="border:1px solid black; border-collapse:collapse">Account</th>
                  <th style="border:1px solid black; border-collapse:collapse">Type</th>
                  <th style="border:1px solid black; border-collapse:collapse">Reason</th>
                  <th style="border:1px solid black; border-collapse:collapse">Amount</th>
                  <th style="border:1px solid black; border-collapse:collapse">Remarks</th>
                  <th style="border:1px solid black; border-collapse:collapse">Settle</th>
              </tr>
              <tr style="border:1px solid black; border-collapse:collapse" v-for="(item) in items" :key="item.id">
                  <td style="border:1px solid black; border-collapse:collapse">{{item.id}}</td>
                  <td style="border:1px solid black; border-collapse:collapse">{{item.transaction_type}}</td>
                  <td style="border:1px solid black; border-collapse:collapse">{{item.account_name}}</td>
                  <td style="border:1px solid black; border-collapse:collapse">{{item.type_name}}</td>
                  <td style="border:1px solid black; border-collapse:collapse">{{item.reason}}</td>
                  <td style="text-align:right;border:1px solid black; border-collapse:collapse">{{item.amount}}</td>
                  <td style="border:1px solid black; border-collapse:collapse">{{item.remarks}}</td>
                  <td style="border:1px solid black; border-collapse:collapse">{{item.settle}}</td>
              </tr>
          </table>
      </div>
  </v-card>
</template>

<script>
export default {
    props:["items"],
    methods:{
        print(){
            this.$htmlToPaper("printable");
        }
    }
}
</script>

<style>
.h{
    font-family: Arial, Helvetica, sans-serif
}
</style>