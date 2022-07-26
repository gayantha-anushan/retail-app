<template>
  <v-app>
      <v-app-bar app dark flat>
          <v-btn to="/dashboard" icon>
              <v-icon>mdi-home</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          {{docName}}
          <v-spacer></v-spacer>
      </v-app-bar>
      <PurchaseOrder v-if="po"/>
      <GRN v-if="GRNdoc" />
      <Invoice v-if="inv" />
      <IreqNote v-if="ireq"/>
      <IretNote v-if="iret"/>
      <Gren v-if="pret" />
  </v-app>
</template>

<script>
import PurchaseOrder from '../components/transactions/PurchaseOrder.vue'
import GRN from '../components/GRN.vue'
import Invoice from '../components/transactions/invoice/Invoice.vue';
import IreqNote from '../components/IreqNote.vue';
import IretNote from '../components/IretNote.vue';
import Gren from '../components/return/Gren.vue'


export default {
    props:["docutype"],
    data() {
        return {
            docName:'',
            po:false,
            GRNdoc:false,
            inv:false,
            ireq:false,
            iret:false,
            seldocdi:false,
            pret:false,
        }
    },
    components:{
        PurchaseOrder,
        GRN,
        Invoice,
        IreqNote,
        IretNote,
        Gren
    },
    created() {
        if(localStorage.getItem('UserToken') == null){
            this.$router.push('/')
        }
        switch(this.docutype){
            case "PO":this.po = true;
            this.docName = 'Purchase Order';
            break;
            case "GRN":this.GRNdoc = true;
            this.docName = 'Good Receive Note';
            break;
            case "INV":this.inv = true;
            this.docName = 'Invoice';
            break;
            case "MRN":this.ireq = true;
            this.docName = 'Item Request Note';
            break;
            case "MREN":this.iret = true;
            this.docName = 'Item Return Note';
            break;
            case "GREN":this.pret = true;
            this.docName = 'Purchase Return Note';
            break;
        }
    },
}
</script>

<style>

</style>