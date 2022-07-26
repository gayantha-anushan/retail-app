import axios from 'axios';

const url = "/api/mainex";

class MainTransService{
    static AddAccount(code,name){
        return axios.post(`${url}/add-account`,{
            code:code,
            name:name
        })
    }
    static AddType(name,account){
        return axios.post(`${url}/create-type`,{
            name:name,
            account:account
        })
    }
    static GetAllAccounts(){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/all-accounts`).then((res)=>{
                    const data = res.data;
                    resolve(data.map(dtas=>({
                        ...dtas
                    })))
                })
            }catch(error){
                reject(error);
            }
        })
    }
    static GetTypeByAccount(id){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/types-by-acc/${id}`).then((res)=>{
                    const data = res.data;
                    resolve(data.map(dtas=>({
                        ...dtas
                    })))
                })
            }catch(error){
                reject(error);
            }
        })
    }

    static SetOff(date,main_trans,amount,cash,bank,cheque,chequeid,bankid){
        return axios.post(`${url}/setoff`,{
            date:date,
            main_trans:main_trans,
            amount:amount,
            cash:cash,
            bank:bank,
            cheque:cheque,
            chequeid:chequeid,
            bankid:bankid
        })
    }

    static ExpenseMain(date,account,type,description,amount,remarks){
        return axios.post(`${url}/expense`,{
            date:date,
            account:account,
            type:type,
            description:description,
            amount:amount,
            remarks:remarks
        })
    }

    static GetMainTransactions(account,type,status){
        return new Promise((resolve,reject)=>{
            try{
                axios.post(`${url}/get-transactions`,{
                    account:account,
                    type:type,
                    status:status
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
export default MainTransService;