import axios from 'axios';

const url = "/api/report";

class StrService{
    static Generate(cat,sub_cat,date){
        return new Promise((resolve,reject)=>{
            try{
                axios.post(`${url}/new-str`,{
                    category:cat,
                    sub_cat:sub_cat,
                    date:date,
                }).then((result)=>{
                    const data = result.data;
                    resolve(data);
                })
            }catch(error){
                reject(error)
            }
        })
    }
    static UpdateCountedStock(id,data){
        return axios.post(`${url}/stc-update-items/${id}`,{
            data:data,
        })
    }
    static CompleteReportChanges(id){
        return axios.get(`${url}/complete/${id}`);
    }
    static GetPrintableReport(id){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/stc-print/${id}`).then((res)=>{
                    const data = res.data;
                    resolve(data.map(datas=>({
                        ...datas
                    })))
                })
            }catch(error){
                reject(error);
            }
        })
    }
    static GetPrintableHistoryReport(id){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/stc-history-print/${id}`).then((res)=>{
                    const data = res.data;
                    resolve(data.map(datas=>({
                        ...datas
                    })))
                })
            }catch(error){
                reject(error);
            }
        })
    }
}
export default StrService;