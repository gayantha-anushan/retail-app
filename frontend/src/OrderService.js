import axios from 'axios'

const url = '/api/orders'

class OrderService{
    static InsertOrder(stake,required,total,disc,final,rem,user,reference,delterm,payterm,type,items,vat_perc,disc_am,vat_am){
        return new Promise((resolve,reject)=>{
            try{
                axios.post(`${url}/add`,{
                    stake:stake,
                    required:required,
                    payterm:payterm,
                    items:items,
                    disc_am:disc_am,
                    vat_am:vat_am,
                    vat_perc:vat_perc,
                    type:type,
                    requested:new Date().toISOString().slice(0,10),
                    total:total,
                    reference:reference,
                    delterm:delterm,
                    disc:disc,
                    final:final,
                    rem:rem,
                    user:user,
                }).then((res)=>{
                    const data = res.data
                    resolve(data)
                })
            }catch(error){
                reject(error)
            }
        })
        
    }
    static GetCompletePO(id){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/complete-po/${id}`).then((res)=>{
                    const data = res.data;
                    resolve(data);
                })
            }catch(error){
                reject(error)
            }
        })
    }
    static DeletePO(poid){
        return axios.delete(`${url}/allpo/${poid}`);
    }
    static GETAllOrders(){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/alldoc`).then((res)=>{
                    const data = res.data;
                    resolve(data.map(dat=>({
                        ...dat
                    })))
                })
            }catch(error){
                reject(error)
            }
        })
    }
    static GETPendingOrders(){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/itemfilter`).then((res)=>{
                    const data = res.data;
                    resolve(data.map(dat=>({
                        ...dat
                    })))
                })
            }catch(error){
                reject(error)
            }
        })
    }
    static StateChangeItem(doc,item,newqty){
        return axios.post(`${url}/successqty`,{
            doc:doc,
            item:item,
            newqty:newqty
        })
    }
    static GETOrderData(document){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/alldatas/${document}`).then((res)=>{
                    const data = res.data;
                    resolve(data.map(dat=>({
                        ...dat
                    })))
                })
            }catch(error){
                reject(error)
            }
        })
    }
    static GETOrderItems(document){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/allitems/${document}`).then((res)=>{
                    const data = res.data;
                    resolve(data.map(dat=>({
                        ...dat
                    })))
                })
            }catch(error){
                reject(error)
            }
        })
    }
    static InsertItem(item,doc,up,qty,disc,tot,fin){
        return axios.post(`${url}/additem`,{
            item:item,
            doc:doc,
            up:up,
            qty:qty,
            disc:disc,
            tot:tot,
            fin:fin
        })
    }
}

export default OrderService