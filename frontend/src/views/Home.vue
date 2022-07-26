<template>
  <v-app>
    <v-main>
      <v-container fill-height fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="4">
            <v-card style="padding:1rem;margin:1rem">
              <v-card-title>Login</v-card-title>
              <v-form>
                <v-text-field label="Username" v-model="uname"></v-text-field>
                <v-text-field label="Password" type="password" v-model="upass"></v-text-field>
                <v-btn @click="login()" dark>Login</v-btn>
              </v-form>
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
  </v-app>
</template>

<script>
import UserService from '../UserService'

export default {
  name: 'Home',
  components: {
  },
  data() {
    return {
      uname:"",
      upass:"",
      error:"",
      snackbar:false,
      timeout:2000
    }
  },
  async created() {
    this.$store.commit("updateSettings")
    if(localStorage.getItem('UserToken') != null){
      var ires = localStorage.getItem('UserToken')
      this.$store.commit('checkpermissions',ires);
      var data = await UserService.GetUserDetails(ires);
      localStorage.setItem('username',data[0].username)
      localStorage.setItem('occupation',data[0].occupation)
      this.$router.push('/dashboard')
    }
  },
  methods: {
    async login(){
      //login from axios
      try{
        var ires = await UserService.login(this.uname,this.upass);
        localStorage.setItem('UserToken',ires);
         this.$store.commit('checkpermissions',ires);
         var data = await UserService.GetUserDetails(ires);
         localStorage.setItem('username',data[0].username)
         localStorage.setItem('occupation',data[0].occupation)
         this.$router.push('/dashboard');
      }catch(error){
        this.error = "Errors Found"
        this.snackbar = true;
      }
      // if(ires.length == 1){
      //   console.lo
      //   localStorage.setItem('token',ires)
      //   localStorage.setItem('username',ires[0].username)
      //   localStorage.setItem('occupation',ires[0].occupation)
      //  
      //   
        
      // }else{
      //   this.snackbar = true
      //   this.error = "User Not Found!";
      // }
    },
  },
}
</script>
