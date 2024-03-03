import axios from 'axios';

const url = "/api/setting";

class SettingService{
    static updateSetting(name,status){
        return axios.post(url,{
            name:name,
            status:status
        })
    }
    static UploadFile(file){
        const formData = new FormData();
        formData.append("file",file);
        return axios.post(`${url}/upload-item-data`,formData)
    }
    static getAllPermissions(){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/permissionlist`).then((res)=>{
                    const data = res.data;
                    resolve(data.map(plist=>({
                        ...plist
                    })))
                })
            }catch(error){
                reject(error)
            }
        })
    }
    static getSetting(name){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/${name}`).then((res)=>{
                    const data = res.data;
                    resolve(data.map(settings=>({
                        ...settings
                    })))
                })
            }catch(error){
                reject(error)
            }
        })
    }
}

export default SettingService;