const express = require('express')
const router = express.Router()
const BaseData = require('../BaseData')
const logger = require('logger').createLogger(__dirname+'/log_files/activity.txt');
const mysql2 = require('mysql2/promise');
var connectionPool = mysql2.createPool(BaseData.getMysqlConfig());
//success
// try{
//     var connection = await connectionPool.getConnection();
//     connection.release();
// }catch(error){
//     logger.error(error);
//     res.status(500).send();
// }
router.post('/it',async (req,res)=>{
    try{
        var conn =await connectionPool.getConnection();
        var sqls = "insert into items (code,name,description,unit,type,quantity,price,discount,orders)values (?,?,?,?,?,?,?,?,0)"
        var [result] = await conn.execute(sqls,[req.body.code,req.body.name,req.body.desc,req.body.unit,req.body.type,req.body.qty,req.body.up,req.body.disc])
        var date = new Date().toISOString().slice(0,10)
        var total = Number(req.body.uv)*Number(req.body.qty)
        var qll = "insert into bin_card(date,item,in_quantity,in_up,in_total,type)values(?,?,?,?,?,'CREATE')"
        await conn.execute(qll,[date,result.insertId,req.body.qty,req.body.uv,total]);
        conn.release();
        res.status(200).send()
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})
// success and tested
router.delete('/it/:id',async (req,res)=>{
    var sqls = "update items set sttatus = 'DEACTIVE',rep_block = 0 where id = "+req.params.id;
    try{
        var connection = await connectionPool.getConnection();
        await connection.execute(sqls,[req.params.id]);
        res.status(200).send();
        connection.release();
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})
router.get('/item/:id',async (req,res)=>{
    try{
        var connection = await connectionPool.getConnection();
        var [result,fields] = await connection.execute("select rep_block from items where id = ?",[req.params.id]);
        if(result.length == 1){
            var idss = result[0].rep_block
            if(idss == 0){
                await connection.execute("update items set sttatus = 'ACTIVE' where id = ?",[req.params.id])
                res.status(200).send()
            }else{
                res.status(500).send()
            }
        }else{
            res.status(500).send()
        }
        connection.release();
    }catch(error){
        logger.error(error)
        res.status(500).send()
    }
})


router.get('/cats_and_num_types',async (req,res)=>{
    var sqls = "select * from categories";
    try{
        var connection = await connectionPool.getConnection();
        var [result,fields] = await connection.execute(sqls)
        res.send(result);
        connection.release();
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

router.get('/types_of_category/:id',async (req,res)=>{
    var sqls = "select * from types where category_id = ?";
    try{
        var connection = await connectionPool.getConnection();
        var [result,fields] =await connection.execute(sqls,[req.params.id])
        res.send(result);
        connection.release();
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

router.get('/item-by-type/:id',async (req,res)=>{
    var sqls = "select * from items where sttatus='ACTIVE' &&  type = ?";
    try{
        var connection = await connectionPool.getConnection();
        var [result,fields] =await connection.execute(sqls,[req.params.id])
        res.send(result);
        connection.release();
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

//success tested
router.get('/it/:id',async (req,res)=>{
    var sqls = "select * from items where  sttatus='ACTIVE' && id = ?";
    try{
        var connection = await connectionPool.getConnection();
        var [result,fields] =await connection.execute(sqls,[req.params.id])
        res.send(result);
        connection.release();
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

router.get('/it-all',async (req,res)=>{
    var sqls = "select items.*,categories.name as category_name,types.name as type_name from items,categories,types where  items.sttatus='ACTIVE' && items.type = types.id && types.category_id = categories.id";
    try{
        var connection = await connectionPool.getConnection();
        var [result,fields] =await connection.execute(sqls)
        res.send(result);
        connection.release();
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

router.get('/itc/:code',async (req,res)=>{
    var sqls = "select * from items where  sttatus='ACTIVE' && code = ?";
    try{
        var connection = await connectionPool.getConnection();
        var [result,fields] =await connection.execute(sqls,[req.params.code])
        res.send(result);
        connection.release();
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

router.get('/itty/:id',async (req,res)=>{
    var sqls = "select * from items where  sttatus='ACTIVE' && type = ?";
    try{
        var connection = await connectionPool.getConnection();
        var [result,fields] = await connection.execute(sqls,[req.params.id])
        res.send(result);
        connection.release();
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})
//success ested 
router.get('/it',async (req,res)=>{
    var sqls = "select items.*,categories.name as catrgory,types.name as typei from categories,items,types where types.category_id = categories.id and items.type = types.id";
    try{
        var connection = await connectionPool.getConnection();
        var [result,fields] =await connection.execute(sqls)
        res.send(result);
        connection.release();
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})


//testing success
router.post('/cat',async (req,res)=>{
    var cat = "insert into categories (name) values (?) ";
    try{
        var connection = await connectionPool.getConnection();
        var [result,fields] = await connection.execute(cat,[req.body.name])
        res.send(result);
        connection.release();
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
});
//get all categories
///testing success
router.get('/cats',async (req,res)=>{
    var cat = "select * from categories";
    try{
        var connection = await connectionPool.getConnection();
        var [result,fields] =await connection.execute(cat)
        res.send(result);
        connection.release();
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})
//get category by id
//success
router.get('/cat/:id',async (req,res)=>{
    var cat = "select * from categories where  id = "+req.params.id;
    try{
        var connection = await connectionPool.getConnection();
        var [result,fields] =await connection.execute(sqls,[req.params.id])
        res.send(result);
        connection.release();
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

router.post('/type',async (req,res)=>{
    var type = "insert into types (name,category_id) values ('"+req.body.name+"',"+req.body.id+")"
    try{
        var connection = await connectionPool.getConnection();
        await  connection.execute(type,[req.body.name,req.body.id])
        res.status(201).send();
        connection.release();
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

//get all types by id
router.get('/type/:id',async (req,res)=>{
    var sqls = "select * from types where category_id = ?";
    try{
        var connection = await connectionPool.getConnection();
        var [result,fields] = await connection.execute(sqls,[req.params.id])
        res.send(result);
        connection.release();
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})



module.exports = router;