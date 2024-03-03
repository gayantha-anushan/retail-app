import axios from 'axios'

const url = '/api/pay'

class PaymentService{
    static InsertCreditGrn(grn_id,paid,cash,bank,cheque,bank_id,cheq_id,user){
        //:new Date().toISOString().slice(0,10),
        return new Promise((resolve,reject)=>{
            try{
                 axios.post(`${url}/credit-grn-pay`,{
                     id:grn_id,
                     date:new Date().toISOString().slice(0,10),
                     cash:cash,
                     paid:paid,
                     bank:bank,
                     cheque:cheque,
                     bankid:bank_id,
                     cheqid:cheq_id,
                     user:user
                 }).then((res)=>{
                     const data = res.data;
                     resolve(data)
                 })
            }catch(error){
                reject(error);
            }
        })
    }
    static InsertAdvance(date,stakeholder,total,cash,trid,bank,checkid,checkam){
        return new Promise((resolve,reject)=>{
            try{
                axios.post(`${url}/adv`,{
                    date:date,
                    stakeholder:stakeholder,
                    total:total,
                    cash:cash,
                    trid:trid,
                    bank:bank,
                    checkid:checkid,
                    checkam:checkam
                }).then((res)=>{
                    const data = res.data;
                    resolve(data)
                })
            }catch(error){
                reject(error)
            }
        })
    }
    static PendingPayments(){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/allstake`).then((res)=>{
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
    static InsertCreditPay(transaction,amount,invoice){
        return axios.post(`${url}/credit-invoice`,{
            transaction:transaction,
            invoice:invoice,
            amount:amount
        })
    }
    static PayAdvanceGrn(grns,advances){
        return axios.post(`${url}/pay-advance-grn`,{
            grns:grns,
            advances:advances
        })
    }
    static getUnpaidAdvancesSupplier(id){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/unpaid-advances-supplier/${id}`).then((res)=>{
                    const data = res.data;
                    resolve(data.map(listener=>({
                        ...listener
                    })))
                })
            }catch(error){
                reject(error)
            }
        })
    }
    static GETAdvance(id){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/advance/${id}`).then((res)=>{
                    const data = res.data;
                    resolve(data.map(lister=>({
                        ...lister
                    })))
                })
            }catch(error){
                reject(error);
            }
        })
    }
    static GETAllAdvances(type){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/advance-list/${type}`).then((res)=>{
                    const data = res.data;
                    resolve(data.map(listener=>({
                        ...listener
                    })))
                })
            }catch(error){
                reject(error)
            }
        })
    }
    static GETIncompletedInvoices(){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/credited-invoices`).then((res)=>{
                    const data = res.data;
                    resolve(data.map(alist=>({
                        ...alist
                    })))
                })
            }catch(error){
                reject(error);
            }
        })
    }
    static GetAdvancesByStake(id){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/adv-by-stake/${id}`).then((res)=>{
                    const data = res.data;
                    resolve(data.map(alist=>({
                        ...alist
                    })))
                })
            }catch(error){
                reject(error)
            }
        })
    }
}

export default PaymentService