const express = require('express')
const router = express.Router()
const BaseData = require('../BaseData')
const mysql = require('mysql2/promise');
const LoginFunctions = require('../functions/LoginFunctions');
const logger = require('logger').createLogger(__dirname+'/log_files/activity.txt');
var connectionPool = mysql.createPool(BaseData.getMysqlConfig());

router.post('/add',async (req,res)=>{
    try{
        var connection = await connectionPool.getConnection();
        var ussr =await LoginFunctions.GetIDFromToken(req.body.data.user)
        var sqls = "INSERT INTO item_return_note (return_date,reference,invoice,returned_amount,reason,date,user)values(?,?,?,?,?,?,?)";
        var [result,fields] = await connection.execute(sqls,[req.body.data.return_date,req.body.data.reference,req.body.data.invoice.id,req.body.data.released,req.body.data.reason,req.body.data.date,ussr]);
        var insertId = result.insertId
        var allItems = req.body.data.items;
        for(var i = 0 ; i < allItems.length ; i++){
            var sqlq = "INSERT INTO item_return_items(item_id,quantity,unit_price,total,discount,final,document) VALUES (?,?,?,?,?,?,?)";
            var unit_p = Number(allItems[i].final)/Number(allItems[i].quantity);
            var bin_data = "select sum(in_quantity - out_quantity) as total_quantity,sum(in_total -out_total) as total_cost from bin_card where item =?";
            var [rms,fms] = await connection.execute(bin_data,[allItems[i].id]);
            if(rms.length > 0){
                var avg = Number(rms[0].total_cost)/Number(rms[0].total_quantity)
                var totalist = Number(allItems[i].quantity) * Number(avg)
                var sqlp = "insert into bin_card(date,item,out_quantity,out_up,out_total,type,IRET)values(?,?,?,?,?,'IRET',?)";
                await connection.execute(sqlp,[req.body.data.date,allItems[i].id,-Number(allItems[i].quantity),avg,-Number(totalist),insertId])
            }
            await connection.execute(sqlq,[allItems[i].id,allItems[i].quantity,allItems[i].unit_price,allItems[i].total,allItems[i].discount,allItems[i].final,insertId]);
        }
        connection.release();
        res.status(200).send({id:insertId}) 
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

router.get('/all',async (req,res)=>{
   try{
    var connection = await connectionPool.getConnection();
    var sqls = "select * from item_return_note"
    var [result,scema] =await  connection.execute(sqls);
    connection.release();
    res.status(200).send(result)
   }catch(error){
       logger.error(error);
       res.status(500).send()
   }
})

router.get('/iret-complete/:id',async (req,res)=>{
    try{
        var sqls = "select * from item_return_note where id="+req.params.id;
        var connection = await connectionPool.getConnection();
        var [result,field] = await connection.execute(sqls);
        var sqlq = "select item_return_items.*,items.code,items.name,items.unit from item_return_items,items where items.id = item_return_items.item_id && document=?";
        var [results,fields] = await connection.execute(sqlq,[req.params.id]);
        var rs = result[0];
        rs.items = results;
        connection.release();
        res.status(200).send(rs);
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

router.get('/gren-complete/:id',async (req,res)=>{
    try{
        var connection = await connectionPool.getConnection();
        var sqls = "select * from grn_return_note where id=?";
        var sqlq = "select grn_returned_items.*,items.code,items.name,items.unit from grn_returned_items,items where items.id = grn_returned_items.item && document=?";
        var [result,field] = await connection.execute(sqls,[req.params.id]);
        var [results,fields] = await connection.execute(sqlq,[req.params.id]);
        var rs = result[0];
        rs.items = results;
        connection.release();
        res.status(200).send(rs);
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

router.get('/gren-list',async (req,res)=>{
    try{
        var connection = await connectionPool.getConnection();
        var sqls = "select * from  grn_return_note";
        var [results,fields] = await connection.execute(sqls);
        connection.release();
        res.status(200).send(results);
    }catch(error){
        logger.error(error)
        res.status(500).send(error)
    }
})

router.post('/purchase-return-create',async (req,res)=>{
    try{
        var connection = await connectionPool.getConnection();
        var sqls = "insert into grn_return_note (code,date,returned_date,grn,total,discount_percentage,vat_percentage,final,remarks,discounted_amount,vat_amount)values(?,?,?,?,?,?,?,?,?,?,?)"
        var allItems = req.body.data.items;
        var [resu,fiel] = await connection.execute(sqls,[req.body.data.ref,req.body.data.edate,req.body.data.rdate,req.body.data.grn.id,req.body.data.total_am,req.body.data.disc_perc,req.body.data.vat_perc,req.body.data.final_amount,req.body.data.rem,req.body.data.disc_am,req.body.data.vat_am])
        var doc_id = resu.insertId;
        for(var i = 0 ; i < allItems.length ; i++){
            var sqlq = "insert into grn_returned_items(item,quantity,unit_price,total,discount,final,document)values(?,?,?,?,?,?,?)"
            var unitp = Number(allItems[i].final)/Number(allItems[i].quantity)
            var bin_data = "select sum(in_quantity - out_quantity) as total_quantity,sum(in_total -out_total) as total_cost from bin_card where item =?";
            var [rms,fms] = await connection.execute(bin_data,[allItems[i].item]);
            if(rms.length > 0 ){
                var avg = Number(rms[0].total_cost)/Number(rms[0].total_quantity);
                var total_cost = Number(avg) * Number(allItems[i].quantity);
                var sqlp = "insert into bin_card (date,item,in_quantity,in_up,in_total,type,GREN) values (?,?,?,?,?,'GREN',?)";
                await connection.execute(sqlp,[req.body.data.edate,allItems[i].item,-Number(allItems[i].quantity),avg,-Number(total_cost),doc_id]);
            }

            await connection.execute(sqlq,[allItems[i].item,allItems[i].quantity,allItems[i].unit_price,allItems[i].total,allItems[i].discount,allItems[i].final,doc_id]);
        }
        connection.release();
        res.status(200).send({id:doc_id});
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})


module.exports = router;