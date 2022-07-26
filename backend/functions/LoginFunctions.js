const mysql = require("mysql2/promise");
const BaseData = require('../BaseData')
const Security = require('../Security')
const jwt = require('jsonwebtoken');


var connectionPool = mysql.createPool(BaseData.getMysqlConfig());

var signature = "force=mass/acceleration"

class LoginFunctions{
    // static CreateRandom(){
    //     var result = ''
    //     var characters = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890"
    //     var length = characters.length;
    //     var stringLength = 20
    //     for(var i = 0 ; i < stringLength ; i++){
    //         result += characters.charAt(Math.floor(Math.random()*length));
    //     }
    //     return result;
    // }

    // static createUniqueLoginID(){
    //     return new Promise(async (resolve,reject)=>{
    //         try{
    //             var connection = await connectionPool.getConnection();
    //             var unsuccess = true;
    //             var genStr = ""
    //             while(unsuccess){
    //                 genStr = this.CreateRandom();
    //                 var query = "select auth_token from login_tokens where auth_token = ?";
    //                 var [result,fields] = await connection.execute(query,[genStr]);
    //                 if(result.length == 0){
    //                     unsuccess = false
    //                 }
    //             }

    //             connection.release();
    //             resolve(genStr)
    //         }catch(error){
    //             reject(error)
    //         }
    //     })
    // }

    static LogOut(authToken){
        return new Promise(async (resolve,reject)=>{
            try{
                resolve(true);
            }catch(error){
                reject(error);
            }
        })
    }

    // static Login(username,password){
    //     return new Promise(async (resolve,reject)=>{
    //         var auth_token = await this.createUniqueLoginID();
    //         var sqls = "select * from users where username = ? and password=?";
    //         try{
    //             var connection = await connectionPool.getConnection();
    //             var [result,fields] = await connection.execute(sqls,[username,Security.encrypt(password)])
    //             if(result.length == 1){
    //                 var quary = "insert into login_tokens (user_id,login_date,auth_token,status) values (?,?,?,?)"
    //                 var data = await connection.execute(quary,[result[0].id,new Date().toISOString().slice(0,10),auth_token,'ONLINE'])
    //                 data.token = auth_token;
    //                 resolve(data);
    //             }else{
    //                 console.log(result)
    //                 reject("Multiple Users Are Available")
    //             }
    //             connection.release()
    //         }catch(error){
    //             reject(error)
    //         }
    //     })
    // }
    static Login(username,password){
        return new Promise(async (resolve,reject)=>{
            var sqls = "select * from users where username = ? and password=?";
            try{
                var connection = await connectionPool.getConnection();
                var [result,fields] = await connection.execute(sqls,[username,Security.encrypt(password)])
                if(result.length == 1){
                    const data = jwt.sign({id:result[0].id,occupation:result[0].occupation},signature,{expiresIn:60*60*12});
                    resolve(data);
                }else{
                    console.log(result)
                    reject("Multiple Users Are Available")
                }
                connection.release()
            }catch(error){
                reject(error)
            }
        })
    }
    // static GetIDFromToken(token){
    //     return new Promise(async (resolve,reject)=>{
    //         try{
    //             var connection = await connectionPool.getConnection();
    //             var sqls = "select user_id from login_tokens where auth_token = ?"
    //             var [result,fields] = await connection.execute(sqls,[token])
    //             if(result.length == 1){
    //                 resolve(result[0].user_id)
    //             }else{
    //                 reject({message:"Could not find user"})
    //             }
    //         }catch(error){
    //             reject(error)
    //         }
    //     })
    // }
    static GetIDFromToken(token){
        return new Promise(async (resolve,reject)=>{
            try{
                var decoded = jwt.verify(token,signature)
                resolve(decoded.id);
            }catch(error){
                reject(error)
            }
        })
    }
}

module.exports = LoginFunctions