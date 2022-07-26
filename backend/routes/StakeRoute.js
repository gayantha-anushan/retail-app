const express = require('express')
const router = express.Router()
const BaseData = require('../BaseData')
const logger = require('logger').createLogger(__dirname+'/log_files/activity.txt');
const mysql2 = require('mysql2/promise')

var connectionPool = mysql2.createPool(BaseData.getMysqlConfig());

// try{
//     var connection = await connectionPool.getConnection();
// }catch(error){
//     logger.error(error);
//     res.status(500).send();
// }

router.post('/',async (req,res)=>{
    var sqls = "insert into stakeholders (name,address1,address2,address3,email,telephone,type) values (?,?,?,?,?,?,?)";
    try{
        var connection = await connectionPool.getConnection();
        await connection.execute(sqls,[req.body.name,req.body.add1,req.body.add2,req.body.add3,req.body.email,req.body.tele,req.body.type]);
        res.status(201).send()
        connection.release();
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

router.get('/:type',async (req,res)=>{
    var sqls = "select * from stakeholders where type = ?";
    try{
        var connection = await connectionPool.getConnection();
        var [result,fields] = await connection.execute(sqls,[req.params.type]);
        res.send(result);
        connection.release()
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

router.get('/one/:id',async (req,res)=>{
    var sqls = "select * from stakeholders where id =?";
    try{
        var connection = await connectionPool.getConnection();
        var [result,fields] = await connection.execute(sqls,[req.params.id]);
        if(result.length == 1){
            res.status(200).send(result[0]);
        }else{
            res.status(500).send();
        }
        connection.release()
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

router.get('/start-stake/:id',async (req,res)=>{
    try{
        var sqls = "update stakeholders set status = 'ACTIVE' where id = ?";
        var connection = await connectionPool.getConnection();
        await connection.execute(sqls,[req.params.id])
        res.status(200).send()
        connection.release()
    }catch(error){
        logger.error(error)
        res.status(500).send();
    }
})

router.delete('/:id',async (req,res)=>{
    try{
        var sqls = "update stakeholders set status='DEACTIVE' where id = ?";
        var connection = await connectionPool.getConnection();
        await connection.execute(sqls,[req.params.id])
        res.status(200).send()
        connection.release()
    }catch(error){
        logger.error(error)
        res.status(500).send();
    }
})
//All functions are success and tested by postman
module.exports = router;