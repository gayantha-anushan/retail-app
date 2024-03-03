//here is item request service
import axios from 'axios'

const url = "/api/ireq"

class InvoiceService{
    static InsertItemRequest(reqdate,customer,reference,cusref,total,discount,final,remarks,user,date){
        return new Promise((resolve,reject)=>{
            try{
                axios.post(`${url}/add`,{
                    reqdate:reqdate,
                    customer:customer,
                    reference:reference,
                    cusref:cusref,
                    total:total,
                    discount:discount,
                    final:final,
                    remarks:remarks,
                    user:user,
                    date:date
                }).then((res)=>{
                    const data = res.data
                    resolve(data.map(datas=>({
                        ...datas
                    })))
                })
            }catch(error){
                reject(error)
            }
        })
    }
    static getAllDataOfDocument(document){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/document/${document}`).then((res)=>{
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
    static getAllDataDocument(document){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/complete-item-request/${document}`).then((res)=>{
                    const data = res.data;
                    resolve(data)
                })
            }catch(error){
                reject(error);
            }
        })
    }
    static getAllItemsInRequest(request){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/items/${request}`).then((res)=>{
                    const data = res.data
                    resolve(data.map(datas=>({
                        ...datas
                    })))
                })
            }catch(error){
                reject(error)
            }
        })
    }
    static getAllRequests(){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/all`).then((res)=>{
                    const data = res.data
                    resolve(data.map(datas=>({
                        ...datas
                    })))
                })
            }catch(error){
                reject(error)
            }
        })
    }
    static DeleteItemRequest(noteid){
        return axios.delete(`${url}/deleteall/${noteid}`)
    }
    static InsertRequestItem(item,document,unitprice,quantity,total,discount,final){
        return axios.post(`${url}/allitems`,{
            item:item,
            document:document,
            unitprice:unitprice,
            quantity:quantity,
            total:total,
            discount:discount,
            final:final
        })
    }
}

export default InvoiceService