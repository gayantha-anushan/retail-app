const express = require('express');
const router = express.Router();
const BaseData = require('../BaseData')
const Security = require('../Security')
const mysql2 = require('mysql2/promise')
const logger = require('logger').createLogger(__dirname+'/log_files/activity.txt');
const LoginFunctions = require('../functions/LoginFunctions')

var connectionPool = mysql2.createPool(BaseData.getMysqlConfig());

//success and tested
router.post('/login',async (req,res)=>{
    try{
        var data = await LoginFunctions.Login(req.body.username,req.body.password);
        res.status(200).send({
            isLoginSuccess:true,
            token:data
        })
    }catch(error){
        logger.error(error);
        res.status(200).send({
            isLoginSuccess:false,
            token:null
        })
    }
})

router.delete('/logout/:token',async (req,res)=>{
    try{
        await LoginFunctions.LogOut(req.params.token);
        res.status(200).send();
    }catch(error){
        logger.error()
        res.status(500).send();
    }
})

router.get('/user-data/:token',async (req,res)=>{
    var stringsi = "select users.username,users.occupation from users where id = ?"
    try{
        var connection = await connectionPool.getConnection();
        var id = await LoginFunctions.GetIDFromToken(req.params.token)
        var [data,fields] = await connection.execute(stringsi,[id]);
        if(data.length == 1){
            res.status(200).send(data);
        }else{
            res.status(500).send()
        }
    }catch(error){
        logger.error(error)
        res.status(500).send()
    }
})
//success and tested
router.delete('/user/:id',async (req,res)=>{
    var sqls = "delete from users where id = ?";
    var sqlq = "delete from user_permission where user_id = ?";
    try{
        var connection = await connectionPool.getConnection();
        await connection.execute(sqlq,[req.params.id]);
        await connection.execute(sqls,[req.params.id]);
        connection.release();
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})
//success and tested
router.get('/users',async (req,res)=>{
    var sqls = "select * from users";
    try{
        var connection = await connectionPool.getConnection();
        var [result,fields] = await connection.execute(sqls);
        connection.release();
        res.status(200).send(result);
    }catch(error){
        logger.error(error);
        res.status(500).send(error);
    }
})
//success and tested
router.post('/user',async (req,res)=>{
    var selectQuery = "select * from users where username =? && occupation = ?";
    var sqlQuery = "insert into users (username,password,occupation) values (?,?,?)";
    try{
        var connection = await connectionPool.getConnection();
        var [result,fields] = await connection.execute(selectQuery,[req.body.username,req.body.occupation]);
        if(result.length == 0){
            await connection.execute(sqlQuery,[req.body.username,Security.encrypt(req.body.password),req.body.occupation])
            res.status(201).send();
        }
        connection.release()
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})
//success and tested
router.post('/userpass',async (req,res)=>{
    var sqls = "update users set password=? where id=?";
    try{
        var connection = await connectionPool.getConnection();
        await connection.execute(sqls,[Security.encrypt(req.body.pass),req.body.uid]);
        res.status(201).send();
        connection.release()
    }catch(error){
        res.status(500).send();
    } 
})
//success and tested
router.post('/uperm',async (req,res)=>{
    var sqlc = "select * from user_permission where user_id = ? && permission_id = ?"
    var sqls = "insert into user_permission ( user_id,permission_id) values (?,?)";
    try{
        var connection = await connectionPool.getConnection();
        var [resu,field] = await connection.execute(sqlc,[req.body.uid,req.body.perm]);
        if(resu.length > 0){
            //return error
            res.status(500).send()
        }else{
            await connection.execute(sqls,[req.body.uid,req.body.perm]);
        }
        res.status(201).send();
        connection.release();
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})
// try{
//     var connection = await connectionPool.getConnection();
// }catch(error){
//     logger.error(error);
//     res.status(500).send();
// }
router.get('/uperms/:id',async (req,res)=>{
    var ss = "select permissions.name as permission from permissions,user_permission where  permissions.id = user_permission.permission_id && user_permission.user_id = ?";
    try{
        var connection = await connectionPool.getConnection();
        var uid = await LoginFunctions.GetIDFromToken(req.params.id);
        var [result,fields] =await connection.execute(ss,[uid]);
        res.status(200).send(result);
        connection.release()
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

router.get('/uperm-by-id/:id',async (req,res)=>{
    
    var ss = "select permissions.name as permission from permissions,user_permission where  permissions.id = user_permission.permission_id && user_permission.user_id = ?";
    try{
        var connection = await connectionPool.getConnection();
        var [result,fields] =await connection.execute(ss,[req.params.id]);
        res.status(200).send(result);
        connection.release()
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

//success and tested
router.delete('/uperm/:uid/:perm',async (req,res)=>{
    var sqlSyntax = "delete from user_permission where user_id = ? and permission_id  = ? "
    try{
        var connection = await connectionPool.getConnection();
        await connection.execute(sqlSyntax,[req.params.uid,req.params.perm]);
        res.status(201).send();
        connection.release()
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

module.exports = router;