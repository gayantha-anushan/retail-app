const express = require('express')
const router = express.Router()
const BaseData = require('../BaseData')
const logger = require('logger').createLogger(__dirname+'/log_files/activity.txt');
const mysql2 = require('mysql2/promise');
const LoginFunctions = require('../functions/LoginFunctions');

var connectionPool = mysql2.createPool(BaseData.getMysqlConfig());
// try{
//     var connection = await connectionPool.getConnection();
//     connection.release();
// }catch(error){
//     logger.error(error);
//     res.status(500).send();
// }
router.post('/add',async (req,res)=>{
    var sqls = "INSERT INTO item_requests (reqdate,customer,reference,cusref,total,discount,final,remarks,cby) VALUES (?,?,?,?,?,?,?,?,?)";
    try{
        var connection = await connectionPool.getConnection();
        var ussr = LoginFunctions.GetIDFromToken(req.body.user)
        var [result,fields] = await connection.execute(sqls,[req.body.reqdate,req.body.customer,req.body.reference,req.body.cusref,req.body.total,req.body.discount,req.body.final,req.body.remarks,ussr]);
        res.send([result]);
        connection.release();
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

router.post('/allitems',async (req,res)=>{
    var sqls = "Insert into item_request_items (item,document,unitprice,quantity,total,discount,final) values (?,?,?,?,?,?,?)";
    try{
        var connection = await connectionPool.getConnection();
        await connection.execute(sqls,[req.body.item,req.body.document,req.body.unitprice,req.body.quantity,req.body.total,req.body.discount,req.body.final])
        res.status(201).send();
        connection.release();
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

router.get('/all',async (req,res)=>{
    var sqls = "select item_requests.*,stakeholders.id as cust,stakeholders.name,stakeholders.address1,stakeholders.address2,stakeholders.address3,stakeholders.email,stakeholders.telephone from item_requests,stakeholders where item_requests.customer = stakeholders.id";
    try{
        var connection = await connectionPool.getConnection();
        var [result,fields] = await connection.execute(sqls);
        res.send(result);
        connection.release();
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

router.get('/document/:id',async (req,res)=>{
    var sqls = "select item_requests.*,stakeholders.name as name from item_requests,stakeholders where item_requests.customer = stakeholders.id and item_requests.id = ?";
    try{
        var connection = await connectionPool.getConnection();
        var [result,fields] = await connection.execute(sqls,[req.params.id]);
        res.send(result);
        connection.release();
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

// router.get('/items/:id',(req,res)=>{
//     var sqls = "select items.id as id,items.name as name,items.quantity as available,item_request_items.quantity as quantity, item_request_items.unitprice as unit_price,item_request_items.total as total,item_request_items.discount as discount,item_request_items.final as final from item_request_items,items where item_request_items.item = items.id";
//     con.query(sqls,(error,result,fields)=>{
//         if(error){
//             logger.error(error)
//             res.status(500).send();
//         }else{
//             res.send(result);
//         }
//     })
// })

router.get(`/complete-item-request/:id`,async (req,res)=>{
    try{
        var connection = await connectionPool.getConnection();
        var sqls = "select item_requests.*,stakeholders.name,stakeholders.address1,stakeholders.address2,stakeholders.address3,stakeholders.email,stakeholders.telephone from item_requests,stakeholders where item_requests.customer = stakeholders.id && item_requests.id=?";
        var [result,fields] = await connection.execute(sqls,[req.params.id]);
        var sqlq = "select item_request_items.*,items.code,items.name,items.unit from item_request_items,items where item_request_items.item = items.id && item_request_items.document=?";
        var [results,fields] = await connection.execute(sqlq,[req.params.id]);
        var request = result[0];
        request.items = results;
        connection.release();
        res.status(200).send(request);
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})


// router.delete('/deleteall/:id',(req,res)=>{
//     var sqls = "delete from item_request_items where document = "+req.params.id;
//     var sqlq = "delete from item_requests where id = "+req.params.id;

//     con.query(sqls,(error,result,field)=>{
//         if(error){
//             logger.error(error);
//             res.status(500).send();
//         }else{
            
//             con.query(sqlq,(e,r,f)=>{
//                 if(e){
//                     logger.error(e)
//                     res.status(500).send();
//                 }else{
//                     res.status(201).send();
//                 }
//             })
//         }
//     })
// })

//All functions are success and tested by postman
module.exports = router;
//149