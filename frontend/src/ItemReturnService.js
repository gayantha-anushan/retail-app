import axios from 'axios'

const url = "/api/return"

class ItemReturnService{
    static addNewReturnNote(data){
        return new Promise((resolve,reject)=>{
            try{
                axios.post(`${url}/add`,{
                    data:data
                }).then((res)=>{
                    const data = res.data;
                    resolve(data)
                })
            }catch(error){
                reject(error)
            }
        })
    }
    static addNewItemToNote(item,document,quantity,iup,retamount,unitprice,total){
        return axios.post(`${url}/additem`,{
            item:item,
            document:document,
            quantity:quantity,
            iup:iup,
            retamount:retamount,
            unitprice:unitprice,
            total:total
        })
    }
    static GetAllReturnNotes(){
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
    static GETSingleDocument(id){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/singledoc/${id}`).then((res)=>{
                    const data = res.data;
                    resolve(data.map(datas=>({
                        ...datas
                    })))
                })
            }catch(error){
                reject(error)
            }
        })
    }
    static GETSingleDocItems(id){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/singledocitem/${id}`).then((res)=>{
                    const data = res.data;
                    resolve(data.map(datas=>({  
                        ...datas
                    })))
                })
            }catch(error){
                reject(error)
            }
        })
    }
    static GETCompleteGren(id){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/gren-complete/${id}`).then((res)=>{
                    const data = res.data;
                    resolve(data)
                })
            }catch(error){
                reject(error)
            }
        })
    }
    static GETCompleteIret(id){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/iret-complete/${id}`).then((res)=>{
                    const data = res.data;
                    resolve(data)
                })
            }catch(error){
                reject(error)
            }
        })
    }
    static DeleteReturnNote(id){
        return axios.delete(`${url}/allreturns/${id}`)
    }
    static getAllGren(){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/gren-list`).then((res)=>{
                    const data = res.data;
                    resolve(data.map(dlist=>({
                        ...dlist
                    })))
                })
            }catch(error){
                reject(error);
            }
        })
    }
    //Purchase Return Service 
    static PurchaseReturnNote(data){
        return new Promise((resolve,reject)=>{
            try{
                axios.post(`${url}/purchase-return-create`,{
                    data:data
                }).then((res)=>{
                    const data = res.data;
                    resolve(data)
                })
            }catch(error){
                reject(error)
            }
        })
    }
}

export default ItemReturnService;