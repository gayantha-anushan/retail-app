import axios from 'axios'

const url = "/api/items"

class ItemService{
    static InsertCategory(name){
        return axios.post(`${url}/cat`,{
            name:name
        })
    }
    static InsertType(catid,name){
        return axios.post(`${url}/type`,{
            id:catid,
            name:name
        })
    }
    static InsertItem(code,name,desc,unit,cata,type,qty,up,disc,uv){
        return axios.post(`${url}/it`,{
            name:name,
            code:code,
            desc:desc,
            unit:unit,
            type:type,
            cata:cata,
            qty:qty,
            up:up,
            disc:disc,
            uv:uv
        })
    }
    //invoice
    static GETCategoriesWithNumType(){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/cats_and_num_types`).then((res)=>{
                    const data = res.data;
                    resolve(data.map(categories=>({
                        ...categories
                    })))
                })
            }catch(error){
                reject(error);
            }
        })
    }
    static typesofcategory(category_id){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/types_of_category/${category_id}`).then((res)=>{
                    const data = res.data;
                    resolve(data.map(types=>({
                        ...types
                    })))
                })
            }catch(error){
                reject(error);
            }
        })
    }
    static ItemFromType(category_id){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/item-by-type/${category_id}`).then((res)=>{
                    const data = res.data;
                    resolve(data.map(types=>({
                        ...types
                    })))
                })
            }catch(error){
                reject(error);
            }
        })
    }

    static GetAllAvailableItems(){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/it-all`).then((res)=>{
                    const data = res.data
                    resolve(data.map(items=>({
                        ...items
                    })))
                })
            }catch(error){
                reject(error);
            }
        })
    }
    static GetItemsByType(tid){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/itty/${tid}`).then((res)=>{
                    const data = res.data
                    resolve(data.map(items=>({
                        ...items
                    })))
                })
            }catch(error){
                reject(error);
            }
        })
    }
    static ActivateItem(id){
        return axios.get(`${url}/item/${id}`);
    }
    static DeleteItem(id){
        return axios.delete(`${url}/it/${id}`)
    }
    static getItemByCode(code){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/itc/${code}`).then((res)=>{
                    const data = res.data
                    resolve(data.map(types=>({
                        ...types
                    })))
                })
            }catch(error){
                reject(error);
            }
        })
    }
    static getItemByID(ids){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/it/${ids}`).then((res)=>{
                    const data = res.data
                    resolve(data.map(types=>({
                        ...types
                    })))
                })
            }catch(error){
                reject(error);
            }
        })
    }
}

export default ItemService