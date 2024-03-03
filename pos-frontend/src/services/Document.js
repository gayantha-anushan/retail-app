import axios from 'axios'

const url = '/api/doc'

class DocumentService{
    static GetAllDocuments(){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/all`).then((res)=>{
                    const data = res.data;
                    resolve(data.map(resu=>({
                        ...resu
                    })))
                })
            }catch(error){
                reject(error)
            }
        }) 
    }
    static GetUnpaidDocuments(id){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/unpaid-grns/${id}`).then((res)=>{
                    const data = res.data;
                    resolve(data.map(resu=>({
                        ...resu
                    })))
                })
            }catch(error){
                reject(error)
            }
        })
    }
    static GetCalculatedVats(type){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/calc-vats/${type}`).then((res)=>{
                    const data = res.data;
                    resolve((data.map(dts=>({
                        ...dts
                    }))))
                })
            }catch(error){
                reject(error)
            }
        })
    }
    // static DeleteDocument(docid){
    //     return axios.delete(`${url}/docperm/${docid}`)
    // }
    // static GETDocumentItems(id){
    //     return new Promise((resolve,reject)=>{
    //         try{
    //             axios.get(`${url}/docitem/${id}`).then((res)=>{
    //                 const data = res.data
    //                 resolve(data.map(resu=>({
    //                     ...resu
    //                 })))
    //             })
    //         }catch(error){
    //             reject(error)
    //         }
    //     })
    // }
    // static GETDocumentInfo(id){
    //     return new Promise((resolve,reject)=>{
    //         try{
    //             axios.get(`${url}/document/${id}`).then((res)=>{
    //                 const data = res.data
    //                 resolve(data.map(resu=>({
    //                     ...resu
    //                 })))
    //             })
    //         }catch(error){
    //             reject(error)
    //         }
    //     })
    // }
    static InsertDoc(received,invoice,reference,payment_term,prevDoc,stakedoc,total,remarks,user,vat_persent,disc_persent,vat_amount,desc_amount,final,items){
        return new Promise((resolve,reject)=>{
            try{
                //code
                axios.post(url + '/doc',{
                    received:received,
                    entered:new Date().toISOString().slice(0,10),
                    prevdoc:prevDoc,
                    stakedoc:stakedoc,
                    invoice:invoice,
                    reference:reference,
                    vat_persent:vat_persent,
                    disc_persent:disc_persent,
                    vat_amount:vat_amount,
                    desc_amount:desc_amount,
                    final:final,
                    payment_term:payment_term,
                    total:total,
                    remarks:remarks,
                    user:user,
                    items:items
                }).then((res)=>{
                    const data = res.data;
                    resolve(data)
                })
            }catch(error){
                reject(error);
            }
        })
    }
    static GetGrnAllData(id){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/grn-details/${id}`).then((res)=>{
                    const data = res.data;
                    resolve(data);
                })
            }catch(error){
                reject(error)
            }
        })
    }
    static GetFinalGrnAllData(id){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/final-grn-details/${id}`).then((res)=>{
                    const data = res.data;
                    resolve(data);
                })
            }catch(error){
                reject(error)
            }
        })
    }

    static GetCreditGrn(){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/credited-grn`).then((res)=>{
                    const data = res.data;
                    resolve(data.map(resu=>({
                        ...resu
                    })))
                })
            }catch(error){
                reject(error)
            }
        })
    }
}

export default DocumentService