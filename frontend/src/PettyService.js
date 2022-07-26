import axios from 'axios';

const url = "/api/petty";

class PettyService{
    static AddAccount(code,name,margin){
        return axios.post(`${url}/add-account`,{
            code:code,
            name:name,
            amount:margin
        })
    }
    static AddType(name,account){
        return axios.post(`${url}/create-type`,{
            name:name,
            account:account
        })
    }
    static Expense(account,type,reason,amount,remarks,settle){
        return axios.post(`${url}/expense`,{
          account:account,
          type:type,
          reason:reason,
          amount:amount,
          remarks:remarks,
          settle:settle
        })
    }

    static SetOff(account,reason,amount,remarks,settle){
        return axios.post(`${url}/setoff`,{
            account:account,
            reason:reason,
            amount:amount,
            remarks:remarks,
            settle:settle
        })
    }

    static GetTransactions(account,type,settled,tr_type){
        return new Promise((resolve,reject)=>{
            try{
                axios.post(`${url}/get-transactions`,{
                    account:account,
                    type:type,
                    settled:settled,
                    tr_type:tr_type
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
}

export default PettyService;