import axios from 'axios';

const url = "http://localhost:3000/api/users";

class UserService{
    static async login(uname,pass){
        return new Promise((resolve,reject)=>{
            try{
                axios.post(url+'/login',{username:uname,password:pass}).then((res)=>{
                    const data = res.data;
                    resolve(data)
                })
            }catch(error){
                reject(error)
            }
        })
    }
    static InsertUser(name,occupation,password){
        return axios.post(url+'/user',{
            username:name,
            occupation:occupation,
            password:password
        })
    }
    static GetAllUsers(){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(url+'/users').then((res)=>{
                    const data = res.data;
                    resolve(data.map(users=>({
                        ...users
                    })))
                })
            }catch(error){
                reject(error);
            }
        })
    }
    static GetUserDetails(token){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(url+'/user-data/'+token).then((res)=>{
                    const data = res.data;
                    resolve(data)
                })
            }catch(error){
                reject(error);
            }
        })
    }

    static Logout(auth_token){
        return axios.delete(url+'/logout/'+auth_token)
    }

    static GetUserPermissionList(uid){
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/uperms/${uid}`).then((res)=>{
                    const data = res.data;
                    resolve(data.map(perms=>({
                        ...perms
                    })))
                })
            }catch(error){
                reject(error);
            }
        })
    }

    static GetUserPermissionByID(uid){
        
        return new Promise((resolve,reject)=>{
            try{
                axios.get(`${url}/uperm-by-id/${uid}`).then((res)=>{
                    const data = res.data;
                    resolve(data.map(perms=>({
                        ...perms
                    })))
                })
            }catch(error){
                reject(error);
            }
        })
    }

    static ChangePassword(uid,password){
        return axios.post(url+'/userpass',{
            uid:uid,
            pass:password
        });
    }
    static RemoveUser(uid){
        return axios.delete(`${url}/user/${uid}`);
    }
    static RemovePermission(uid,perm){
        return axios.delete(`${url}/uperm/${uid}/${perm}`);
    }
    static AddNewPermission(uid,perm){
        return axios.post(`${url}/uperm`,{
            uid:uid,
            perm:perm
        });
    }
}
export default UserService;