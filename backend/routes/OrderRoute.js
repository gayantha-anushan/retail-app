const express = require('express')
const router = express.Router()
const BaseData = require('../BaseData');
const mysql2 = require('mysql2/promise');
const LoginFunctions = require('../functions/LoginFunctions');
const logger = require('logger').createLogger(__dirname+'/log_files/activity.txt');
var connectionPool = mysql2.createPool(BaseData.getMysqlConfig());

router.post('/add',async (req,res)=>{
    // console.log("Called!")
    try{
        var connection = await connectionPool.getConnection();
        var ussr =await LoginFunctions.GetIDFromToken(req.body.user)
        var sqls = "insert into purchase_order (stake,required,requested,reference,delivery,payment_term,total,discount,vat_percentage,discount_am,vat_am,final,remarks,uid,type) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        var [result,fields] = await connection.execute(sqls,[req.body.stake,req.body.required,req.body.requested,req.body.reference,req.body.delterm,req.body.payterm,req.body.total,req.body.disc,req.body.vat_perc,req.body.disc_am,req.body.vat_am,req.body.final,req.body.rem,ussr,req.body.type]);
        var items = req.body.items;
        var insertedID = result.insertId;
        for(var i = 0 ; i < items.length ; i++){
            var sqls2 = "insert into purchase_order_items (item,document,unitprice,quantity,discount,total,final) values (?,?,?,?,?,?,?)";
            var sql3 = "update items set orders = orders + ? where id = ?";
            await connection.execute(sqls2,[items[i].item,insertedID,items[i].up,items[i].qty,items[i].disc,items[i].total,items[i].final]);
            await connection.execute(sql3,[items[i].qty,items[i].item]);
        }
        res.status(200).send({id:result.insertId});
        connection.release();
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

router.get('/alldoc',async(req,res)=>{
    var sqls = "select purchase_order.*,stakeholders.name from purchase_order,stakeholders where purchase_order.stake = stakeholders.id";
    try{
        var connection = await connectionPool.getConnection();
        var [result,field] = await connection.execute(sqls);
        connection.release();
        res.status(200).send(result);
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

router.get('/complete-po/:id',async (req,res)=>{
    try{
        var connection = await connectionPool.getConnection();
        var sqls = "select purchase_order.*,stakeholders.name,stakeholders.address1,stakeholders.address2,stakeholders.address3,stakeholders.email,stakeholders.telephone from purchase_order,stakeholders where stakeholders.id = purchase_order.stake && purchase_order.id = ?";
        var sqlq = "select purchase_order_items.*,items.name,items.code,items.unit from purchase_order_items,items where items.id = purchase_order_items.item && document = ?";
        var [result,fields] = await connection.execute(sqls,[req.params.id]);
        var [resul,field] = await connection.execute(sqlq,[req.params.id]);
        var responseModel = result[0];
        responseModel.items = resul;
        res.status(200).send(responseModel);
        connection.release();
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

router.post('/successqty',async (req,res)=>{
    var sqls = "update purchase_order_items set success = success + ? where document = ? and item = ?";
    try{
        var connection = await connectionPool.getConnection();
        await connection.execute(sqls,[req.body.newqty,req.body.doc,req.body.item]);
        connection.release();
        res.status(200).send();
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})
router.get('/allitems/:id',async (req,res)=>{
    var sqls = "select purchase_order_items.*,items.name,items.code from purchase_order_items,items where purchase_order_items.item = items.id and document = ?";
    try{
        var connection = await connectionPool.getConnection();
        var [result,field] = await connection.execute(sqls,[req.params.id]);
        connection.release();
        res.status(200).send(result);
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

router.get('/itemfilter', async (req,res)=>{
    var sqls = "select purchase_order.*,stakeholders.id as st_id,stakeholders.name,stakeholders.address1,stakeholders.address2,stakeholders.address3,stakeholders.email,stakeholders.telephone from  purchase_order,stakeholders where stakeholders.id = purchase_order.stake and purchase_order.id in (select document from purchase_order_items where quantity > sucess)";
    try{
        var connection = await connectionPool.getConnection();
        var [result,field] = await connection.execute(sqls);
        connection.release();
        res.status(200).send(result);
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

module.exports = router
//279