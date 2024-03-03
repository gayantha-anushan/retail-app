import axios from 'axios';

const url = "/api/report";

class ReportService{
    static getStockValuationReport(){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/svr`).then((res)=>{
                    const data = res.data;
                    resolve(data.map(mlist=>({
                        ...mlist
                    })))
                })
            }catch(error){
                reject(error);
            }
        })
    }
    static GETBinCard(id){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/bin-card/${id}`).then((res)=>{
                    const data = res.data;
                    resolve(data.map(dlist=>({
                        ...dlist
                    })))
                })
            }catch(error){
                reject(error)
            }
        })
    }
    static GetHistorySTC(){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/history-stc`).then((res)=>{
                    const data = res.data;
                    resolve(data.map(list=>({
                        ...list
                    })))
                })
            }catch(error){
                reject(error)
            }
        })
    }
    // static updateSetting(name,status){
    //     return axios.post(url,{
    //         name:name,
    //         status:status
    //     })
    // }
    // static getAllPermissions(){
    //     return new Promise((resolve,reject)=>{
    //         try{
    //             axios.get(`${url}/permissionlist`).then((res)=>{
    //                 const data = res.data;
    //                 resolve(data.map(plist=>({
    //                     ...plist
    //                 })))
    //             })
    //         }catch(error){
    //             reject(error)
    //         }
    //     })
    // }
    // static getSetting(name){
    //     return new Promise((resolve,reject)=>{
    //         try{
    //             axios.get(`${url}/${name}`).then((res)=>{
    //                 const data = res.data;
    //                 resolve(data.map(settings=>({
    //                     ...settings
    //                 })))
    //             })
    //         }catch(error){
    //             reject(error)
    //         }
    //     })
    // }
}

export default ReportService;