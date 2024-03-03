import axios from 'axios';
const base_url = "/api"
class CommonGate{
    //GetAllItems() await CommonGate.GetDataSet("items/it")
    // GetAllCategories() await CommonGate.GetDataSet("items/cats")
    static GetDataSet(url){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${base_url}/${url}`).then((res)=>{
                    const data = res.data;
                    resolve(data);
                })
            }catch(error){
                reject(error)
            }
        })
    }
    //GetTypes(this.catoftypes) => CommonGate.GetDataByID('items/type',this.catSelection)
    static GetDataByID(url,id){
        // console.log("Hii => "+id);
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${base_url}/${url}/${id}`).then((res)=>{
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
}
export default CommonGate;