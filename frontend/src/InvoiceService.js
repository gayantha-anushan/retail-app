import axios from 'axios'

const url = "/api/invoice"

class InvoiceService{
    static CreateInvoice(type,cust,ord,total,disc,final,cash,credit,cheq,cheq_id,bank,bank_id,advances,addedItems,rem,user,paid){
        return new Promise((resolve,reject)=>{
            try{
                axios.post(`${url}/create-invoice`,{
                    type:type,
                    cust:cust,
                    ord:ord,
                    total:total,
                    disc:disc,
                    final:final,
                    cash:cash,
                    credit:credit,
                    cheq:cheq,
                    cheq_id:cheq_id,
                    bank:bank,
                    bank_id:bank_id,
                    advances:advances,
                    addedItems:addedItems,
                    paid:paid,
                    rem:rem,
                    date:new Date().toISOString().slice(0,10),
                    user:user
                }).then((res)=>{
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
    static startVatAgain(id){
        return axios.get(`${url}/start-vat/${id}`)
    }
    static CreateVat(invoice,name,percentage,acton){
        return axios.post(`${url}/create-vat`,{
            invoice:invoice,
            name:name,
            percentage:percentage,
            acton:acton
        })
    }
    static ViewAllInvoiceDetails(id){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/all-invoice-details/${id}`).then((res)=>{
                    const data = res.data;
                    resolve(data)
                })
            }catch(error){
                reject(error)
            }
        })
    }
    static ViewAllFinalInvoiceDetails(id){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/all-final-invoice-details/${id}`).then((res)=>{
                    const data = res.data;
                    resolve(data)
                })
            }catch(error){
                reject(error)
            }
        })
    }
    static ViewAllVats(){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/allvats`).then((res)=>{
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
    static GETAllRelatedVats(type){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/calculated-vats/${type}`).then((res)=>{
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
    static ViewAllVatsByInvoice(invoice){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/vat-by-invoice/${invoice}`).then((res)=>{
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
    static DeleteVat(vatid){
        return axios.delete(`${url}/vat/${vatid}`);
    }
    static GETAllInvoices(){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/all`).then((res)=>{
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
    static DeleteInvoice(id){
        return axios.delete(`${url}/allitems/${id}`)
    }
    static GETInvoiceDetails(ids){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/invoice/${ids}`).then((res)=>{
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
    static GETInvoiceVats(ids){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/inv-vats/${ids}`).then((res)=>{
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
    static GETInvoiceData(ids){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/invitems/${ids}`).then((res)=>{
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
    static AddInvoiceItems(item,doc,quant,up,disc,tot,final){
        return new Promise((resolve,reject)=>{
            try{
                axios.post(`${url}/additem`,{
                    item:item,
                    doc:doc,
                    quant:quant,
                    up:up,
                    disc:disc,
                    tot:tot,
                    final:final
                }).then((res)=>{
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
    
}

export default InvoiceService