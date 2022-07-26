<template>
      <v-main>
          <v-container ma-0 pa-0 fluid>
            <v-row>
              <v-col>
                <v-card >
                  <v-card-title>Upload Item List</v-card-title>
                  <ul>
                    <li>You must need to upload content as .csv Format</li>
                    <li>We Require item fields like category,sub_category,code,name,unit,quantity,unit_price,unit_value,discount</li>
                  </ul>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-file-input label="Insert File" v-model="uploadable_file" style="margin-right:20px" ></v-file-input>
                    <v-btn @click="uploadFile()" dark>Upload & Run</v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
          <v-snackbar v-model="snackbar" :timeout="timeout">
                {{error}}
                <template v-slot:action="{ attrs }">
                    <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">Close</v-btn>
                </template>
            </v-snackbar>
      </v-main>
</template>

<script>
import SettingService from '../SettingService';
export default {
    name:'ExcelUpload',
    data(){
      return {
        uploadable_file:null,
        timeout:2000,
        error:"",
        snackbar:false
      }
    },
    created(){
        if(localStorage.getItem('UserToken') == null){
            this.$router.push('/')
        }
    },
    methods:{
      async uploadFile(){
        await SettingService.UploadFile(this.uploadable_file);
        this.uploadable_file = null;
        this.error = "Success!"
        this.snackbar = true;
      }
    }
}
</script>

<style>

</style>