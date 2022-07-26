import axios from 'axios'

const url = "/api/stake"

class StakeService{
    static async GetAllStakes(type){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/${type}`).then((res)=>{
                    const data = res.data;
                    resolve(data.map(stakes=>({
                        ...stakes
                    })))
                })
            }catch(error){
                reject(error);
            }
        })
    }
    static RemoveStake(id){
        return axios.delete(`${url}/${id}`)
    }
    static getStakeFromID(id){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/one/${id}`).then((res)=>{
                    const data = res.data;
                    resolve(data);
                })
            }catch(error){
                reject(error)
            }
        })
    }
    static StartStake(id){
        return axios.get(`${url}/start-stake/${id}`);
    }
    static InsertNewStake(name,add1,add2,add3,email,tele,type){
        return axios.post(url,{
            name:name,
            add1:add1,
            add2:add2,
            add3:add3,
            email:email,
            tele:tele,
            type:type
        })
    }
}

export default StakeService