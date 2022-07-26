<template>
  <v-card  flat style="padding:20px">
      <v-card-actions>
          <v-spacer></v-spacer>
          <v-radio-group v-model="inputVal">
              <v-radio label="Non VAT" value="nvat"></v-radio>
              <v-radio label="VAT" value="vat"></v-radio>
              <v-radio label="SVAT" value="svat"></v-radio>
          </v-radio-group>
          <v-spacer></v-spacer>
      </v-card-actions>
  </v-card>
</template>

<script>
export default {
    props:['value'],
    data() {
        return {
            inputVal:''
        }
    },
    watch:{
        'inputVal':function(){
            this.$emit('input',this.inputVal)
        },
        'value':function(){
            this.inputVal = this.value
        }
    }
}
</script>

<style>

</style>