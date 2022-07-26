const express = require('express')
const router = express.Router()
const BaseData = require('../BaseData')
const csv = require('csv-parser');
const fs = require('fs');
const mysql2 = require('mysql2/promise')
const logger = require('logger').createLogger(__dirname+'/log_files/activity.txt');

var connectionPool = mysql2.createPool(BaseData.getMysqlConfig());

function RunItemInsertion(name){
    var dataList = [];
    fs.createReadStream(`${__dirname}/uploads/${name}`).pipe(csv()).on('data',async (row)=>{
        dataList = dataList.concat(row);
    }).on('end',()=>{
        runDataListInsertion(dataList);
        logger.info(["Insertion of Items are successful",name]);
    })
}

async function runDataListInsertion(dataList) {
    try{
        var connection = await connectionPool.getConnection();
        for(var i = 0 ; i < dataList.length ; i++){
            var ct = "select id from categories where name = ?";
            var [res_ct,field_ct] = await connection.execute(ct,[dataList[i].category]);
            var cat_id = -1;
            if(res_ct.length == 1){
                cat_id = res_ct[0].id;
            }else{
                var in_ct = "insert into categories(name)values(?)";
                var [res,fff] = await connection.execute(in_ct,[dataList[i].category]);
                cat_id = res.insertId;
            }
            var sql_ty = "select id from types where name = ? && category_id = ?";
            var [reas,fias] = await connection.execute(sql_ty,[dataList[i].sub_category,cat_id]);
            var type_id = -1;
            if(reas.length == 1){
                type_id = reas[0].id;
            }else{
                var sql_int = "insert into types (name,category_id) values (?,?)";
                var [rety,fity] = await connection.execute(sql_int,[dataList[i].sub_category,cat_id]);
                type_id = rety.insertId;
            }
            var ins_it = "insert into items (code,name,description,unit,type,quantity,price,discount,orders,sttatus) values (?,?,?,?,?,?,?,?,0.000,?)";
            var [result_ins_it,fields_ins_it] = await connection.execute(ins_it,[dataList[i].code,dataList[i].name,dataList[i].description,dataList[i].unit,type_id,dataList[i].quantity,dataList[i].sale_price,dataList[i].discount,dataList[i].status]);
            if(result_ins_it.insertId > 0){
                var rsid = result_ins_it.insertId;
                var date = new Date().toISOString().slice(0,10)
                var total = Number(dataList[i].quantity) * Number(dataList[i].unit_value)
                var rss_ok = "insert into bin_card (date,item,in_quantity,in_up,in_total,type)values(?,?,?,?,?,'CREATE')";
                await connection.execute(rss_ok,[date,rsid,dataList[i].quantity,dataList[i].unit_value,total])
            }
        }
        connection.release();
    }catch(error){
        logger.error(error)
    }
}

router.post('/upload-item-data',(req,res)=>{
    if(!req.files){
        return res.status(500).send({msg:"File Not Found"});
    }
    const myFile = req.files.file;
    myFile.mv(`${__dirname}/uploads/${myFile.name}`,(err)=>{
        if(err){
            logger.error(err);
            return res.status(500).send({msg:"Error Occured!"});
        }
        res.status(200).send();
        RunItemInsertion(myFile.name);
    })
})

router.get('/permissionlist',async (req,res)=>{
    var per = "select * from permissions";
    try{
        var connection = await connectionPool.getConnection();
        var [result,fields] = await connection.execute(per);
        res.status(200).send(result);
        connection.release();
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

router.post('/',async (req,res)=>{
    var sqls = "update settings set status = ? where name = ?";
    try{
        var connection = await connectionPool.getConnection();
        await connection.execute(sqls,[req.body.status,req.body.name]);
        res.status(201).send();
        connection.release();
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

router.get('/:name',async (req,res)=>{
    var sqls = "select * from settings where name = ?";
    try{
        var connection = await connectionPool.getConnection();
        var [result,fields] = await connection.execute(sqls,[req.params.name]);
        res.send(result);
        connection.release();
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

module.exports = router