<template>
  <v-app>
      <v-app-bar app dark>
          <v-btn to="/dashboard" icon>
            <v-icon>mdi-home</v-icon>
          </v-btn>
          <v-toolbar-title>Add {{selection}}</v-toolbar-title>
      </v-app-bar>
      <v-main>
          <Items v-if="selection == 'Items'"/>
          <Stakes v-if="selection == 'Suppliers'" type="Suppliers" />
          <Stakes v-if="selection == 'Customers'" type="Customer"/>
          <Vat v-if="selection == 'VAT'" />
          <Create v-if="selection == 'Petty Cash'" />
          <ManageMain v-if="selection == 'Main Expenses'" />
      </v-main>
  </v-app>
</template>

<script>
import Items from '../components/Items.vue'
import Stakes from '../components/Stakes.vue'
import Vat from '../components/Vat.vue'
import Create from '../components/petty/Create.vue'
import ManageMain from '../components/expenses/ManageMain.vue'

export default {
    props:['selection'],
    components:{
        Items,Stakes,Vat,Create,ManageMain
    },
    data(){
        return {
            //data here
        }
    },
    async created(){

    },
    methods:{
        //methods here
    },
    watch:{
        //watch from here
    }
}
</script>

<style>

</style>