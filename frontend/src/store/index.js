import Vue from 'vue'
import Vuex from 'vuex'
import UserService from '../UserService'
import SettingService from '../SettingService';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    permissions:[],
    com_name:null,
    com_add1:null,
    com_add2:null,
    com_add3:null,
    com_add_email:null,
    com_add_telephone:null,
  },
  mutations: {
    checkpermissions(state,uid){
      state.permissions = UserService.GetUserPermissionList(uid)
    },
    async updateSettings(state){
      var cn = await SettingService.getSetting("company_name");
      state.com_name = cn[0].status;
      var ca1 = await SettingService.getSetting("address1");
      state.com_add1 = ca1[0].status;
      var ca2 = await SettingService.getSetting("address2");
      state.com_add2 = ca2[0].status;
      var ca3 = await SettingService.getSetting("address3");
      state.com_add3 = ca3[0].status;
      var email = await SettingService.getSetting("email");
      state.com_add_email = email[0].status;
      var tele = await SettingService.getSetting("tele");
      state.com_add_telephone = tele[0].status;
    }
  },
  actions: {
  },
  modules: {
  },
  getters: {
    getName:state=>{
      return state.com_name;
    },
    getAddress:state=>{
      var add = {
        add1:state.com_add1,
        add2:state.com_add2,
        add3:state.com_add3
      }
      return add;
    },
    getEmail:state=>{
      return state.com_add_email;
    },
    getTelephone:state=>{
      return state.com_add_telephone;
    }
  }
})
