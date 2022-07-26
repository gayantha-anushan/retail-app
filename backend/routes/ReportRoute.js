const express = require('express')
const router = express.Router()
const BaseData = require('../BaseData')
const mysql = require('mysql2/promise');
const logger = require('logger').createLogger(__dirname+'/log_files/activity.txt');

var config = BaseData.getMysqlConfig();

router.get('/svr',async (request,response)=>{
    try{
        var con = await mysql.createConnection(config)
        var bin_data = "select types.name as item_type,categories.name as category,items.id,items.code,items.name,items.description,items.unit,sum(bin_card.in_quantity) as purchases,sum(bin_card.out_quantity) as sales ,sum(bin_card.in_quantity - bin_card.out_quantity) as quantity,sum(bin_card.in_total - bin_card.out_total) as total_cost from bin_card,items,categories,types where items.id = bin_card.item && types.id = items.type && types.category_id = categories.id group by bin_card.item";
        var [result,fields] = await con.execute(bin_data);
        if(result.length > 0 ){
            for(var i = 0 ; i < result.length ; i++){
                var intake = "select * from bin_card where type = 'GRN' || type = 'CREATE' order by id desc limit 1"
                var [ress,fiell] = await con.execute(intake);
                if(ress.length > 0){
                    result[i].unit_cost = ress[0].in_up;
                }else{
                    result[i].unit_cost = 0;
                }
                var nz = Number(result[i].total_cost)/Number(result[i].quantity);
                result[i].average_unit_cost = nz.toFixed(2)
            }
        }
        response.status(200).send(result)
    }catch(error){
        logger.error(error)
        response.status(500).send();
    }
})


router.post('/new-str',async (req,res)=>{
    try{
        var connection =  await mysql.createConnection(config)
        var cat;
        var sub_cat;
        if(req.body.category == "ALL"){
            cat = 0;
        }else{
            cat = req.body.category
        }
        if(req.body.sub_cat == "ALL"){
            sub_cat = 0
        }else{
            sub_cat = req.body.sub_cat
        }
        console.log(req.body.category + " => "+ req.body.sub_cat);
        var sqls = "insert into stc_doc(category,sub_cat,date_begin)values("+cat+","+sub_cat+",'"+req.body.date+"')";
        var [resu,fiel] = await connection.execute(sqls);
        if(req.body.category == "ALL"){
            var sqlm = "select items.id,items.price,items.sttatus,sum(bin_card.in_quantity - bin_card.out_quantity) as sys_qty,sum(bin_card.in_total - bin_card.out_total) as sys_total_cost from items,bin_card where bin_card.item = items.id && items.rep_block = 0 group by bin_card.item"
            var sqln = "update items set sttatus = 'DEACTIVE',rep_block = 1 where rep_block = 0";
        }else if(req.body.sub_cat == "ALL"){
            var sqlm = "select items.id,items.price,sttatus,sum(bin_card.in_quantity - bin_card.out_quantity) as sys_qty,sum(bin_card.in_total - bin_card.out_total) as sys_total_cost from items,types,bin_card where types.category_id = "+cat+" && types.id = items.type && items.id = bin_card.item && items.rep_block = 0 group by bin_card.item";
            var sqln = "update items set sttatus = 'DEACTIVE',rep_block = 1 where rep_block=0 && type in (select types.id from types where types.category_id = "+cat+")"
        }else{
            var sqlm = "select items.id,items.price,items.sttatus,sum(bin_card.in_quantity - bin_card.out_quantity) as sys_qty,sum(bin_card.in_total - bin_card.out_total) as sys_total_cost from items,bin_card where items.rep_block = 0 && bin_card.item = items.id && items.type = "+sub_cat+" group by bin_card.item";
            var sqln = "update items set sttatus = 'DEACTIVE',rep_block = 1 where rep_block=0 && type="+sub_cat;
        }
        var [second_data_list,fields] = await connection.execute(sqlm);
        await connection.execute(sqln)
        for(var i = 0 ; i < second_data_list.length ; i++){
            second_data_list[i].average_price = Number(second_data_list[i].sys_total_cost)/Number(second_data_list[i].sys_qty);
        }
        console.log(second_data_list);
        for(var i = 0 ; i < second_data_list.length ; i++){
            
            var items_que = "insert into stc_doc_items (item,document,unit_price,avg_price,last_system,item_status) values ("+second_data_list[i].id+","+resu.insertId+","+second_data_list[i].price+","+second_data_list[i].average_price+","+second_data_list[i].sys_qty+",'"+second_data_list[i].sttatus+"') "
            await connection.execute(items_que);
        }
        res.status(200).send({id:resu.insertId});
    }catch(error){
        logger.error(error);
        res.status(500).send(error);
    }
})
router.get('/stc-history-print/:id',async (req,res)=>{
    try{
        var connection  = await mysql.createConnection(config);
        var sql_str = "select categories.name as category_name,types.name as sub_cat,items.*,stc_doc_items.* from stc_doc_items,items,types,categories where items.id = stc_doc_items.item && categories.id = types.category_id && types.id = items.type && stc_doc_items.status = 'UPDATED' && document = ?";
        var [results,fields] = await connection.execute(sql_str,[req.params.id]);
        res.status(200).send(results);
    }catch(error){
        logger.error(error)
        res.status(500).send(error);
    }
})

router.get('/stc-print/:id',async (req,res)=>{
    try{
        var connection  = await mysql.createConnection(config);
        var sql_str = "select categories.name as category_name,types.name as sub_cat,items.*,stc_doc_items.* from stc_doc_items,items,types,categories where items.id = stc_doc_items.item && categories.id = types.category_id && types.id = items.type && stc_doc_items.status = 'NOT_UPDATED' && document = ?";
        var [results,fields] = await connection.execute(sql_str,[req.params.id]);
        res.status(200).send(results);
    }catch(error){
        logger.error(error)
        res.status(500).send(error);
    }
})

router.get('/bin-card/:id',async (req,res)=>{
    try{
        var sqls = "select * from bin_card where item=?";
        var connection = await mysql.createConnection(BaseData.getMysqlConfig());
        var [results,fields] = await connection.execute(sqls,[req.params.id]);
        var final_data = []
        for(var i = 0 ; i < results.length ; i++ ){
            if(i > 0){
                results[i].total_qty = Number(results[i-1].total_qty) + Number(results[i].in_quantity) - Number(results[i].out_quantity);
                results[i].total_cost = Number(results[i-1].total_cost) + Number(results[i].in_total) - Number(results[i].out_total);
                var avs2 = Number(results[i].total_cost)/Number(results[i].total_qty);
                results[i].avg_up = avs2.toFixed(2)
            }else{
                results[i].total_qty = Number(results[i].in_quantity) - Number(results[i].out_quantity);
                results[i].total_cost = Number(results[i].in_total) - Number(results[i].out_total);
                var avs = Number(results[i].total_cost)/Number(results[i].total_qty);
                results[i].avg_up = avs.toFixed(2)
            }
            final_data = final_data.concat(results[i]);
        }
        res.status(200).send(final_data);
    }catch(error){
        logger.error(error)
        res.status(500).send();
    }
})

router.post('/stc-update-items/:id',async (req,res)=>{
    try{
        var connection = await mysql.createConnection(config);
        var dll = req.body.data;
        for(var i = 0 ; i < dll.length ; i++){
            var sqls = "update  stc_doc_items set last_physical = ?,variance_qty = ?, variance_total=? where item=? && document=?"
            await connection.execute(sqls,[dll[i].last_physical,dll[i].variance_qty,dll[i].variance_total,dll[i].item,dll[i].document]);
        }
        res.status(200).send();
    }catch(error){
        res.status(500).send(error);
    }
})

router.get('/complete/:id',async (req,res)=>{
    try{
        var connection = await mysql.createConnection(config);
        var sel_q =  "select * from stc_doc_items where document = ?";
        var [result,schema] = await connection.execute(sel_q,[req.params.id]);
        var nullable = false;
        for(var i = 0 ; i < result.length ; i++){
            if(result[i].variance_qty == null){
                nullable = true;
            }
        }
        var sqlh = "select status from stc_doc where id=?";
        var [resuu,fiell] = await connection.execute(sqlh,[req.params.id]);
        stts = false;
        if(resuu.length == 1){
            if(Number(resuu[0].status) == 1){
                var stts = true;
            }
        }
        if(!nullable && stts){
            //update document
            var date = new Date().toISOString().slice(0,10)
            var sqla = "update stc_doc set date_end = ?,status=0 where id = ?";
            //update entries
            var sqlb = "update stc_doc_items set status = 'UPDATED' where document =?";
            //update inventry
            await connection.execute(sqla,[date,req.params.id]);
            await connection.execute(sqlb,[req.params.id]);
            for(var i = 0 ; i < result.length ; i++){
                if(Number(result[i].variance_qty) > 0){
                    var changeble = Number(result[i].variance_qty)
                    var total = Number(result[i].variance_total);
                    var sqlqq = "insert into bin_card(date,item,in_quantity,in_up,in_total,type,STC)values(?,?,?,?,?,'STC',?)";
                    var ser = "update items set quantity = quantity + ?,sttatus = ?,rep_block = 0 where id = ?"
                    await connection.execute(sqlqq,[date,result[i].item,changeble,result[i].avg_price,total,result[i].document]);
                    await connection.execute(ser,[changeble,result[i].item_status,result[i].item]);
                }else if(Number(result[i].variance_qty) < 0){
                    var changeble = -Number(result[i].variance_qty)
                    var total = -Number(result[i].variance_total);
                    var sqlqq = "insert into bin_card(date,item,out_quantity,out_up,out_total,type,STC)values(?,?,?,?,?,'STC',?)";
                    var ser = "update items set quantity = quantity - ?,sttatus = ?,rep_block = 0 where id = ?"
                    await connection.execute(sqlqq,[date,result[i].item,changeble,result[i].avg_price,total,result[i].document]);
                    await connection.execute(ser,[changeble,result[i].item_status,result[i].item]);
                }
            }
            res.status(200).send();
        }else{
            logger.info(["Done success!"])
            res.status(500).send();
        }
    }catch(error){
        logger.error(error);
        res.status(500).send(error);
    }
})

router.get('/history-stc',async (req,res)=>{
    try{
        var connection = await mysql.createConnection(config);
        var sqls = "select * from stc_doc where status = 0";
        var [result,fields] = await connection.execute(sqls);
        res.status(200).send(result);
    }catch(error){
        logger.error(error);
        res.status(500).send(error);
    }
})

module.exports = router