const express = require('express');
const router = express.Router();
const BaseData = require('../BaseData')
const Security = require('../Security')
const mysql2 = require('mysql2/promise')
const logger = require('logger').createLogger(__dirname+'/log_files/activity.txt');

var connectionPool = mysql2.createPool(BaseData.getMysqlConfig());

//success in testing 
router.post('/add-account',async (req,res)=>{
    // code , name , margin
    var sqls = "Insert into petty_account (code,name,amount) values (?,?,?)"
    try{
        var connection = await connectionPool.getConnection();
        await connection.execute(sqls,[req.body.code,req.body.name,req.body.amount])
        connection.release()
        res.status(200).send();
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})


router.post('/create-type',async (req,res)=>{
    //name account
    var sqls = "insert into petty_type (name,account) values(?,?)"
    try{
        var connection = await connectionPool.getConnection();
        await connection.execute(sqls,[req.body.name,req.body.account]);
        connection.release()
        res.status(200).send();
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

router.get('/all-accounts',async (req,res)=>{
    var sqls = "select * from petty_account";
    try{
        var connection = await connectionPool.getConnection();
        var [result,fields] = await connection.execute(sqls);
        connection.release()
        res.status(200).send(result);
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

router.get('/types-by-acc/:id',async (req,res)=>{
    var sqls = "select * from petty_type where petty_type.account = ?";
    try{
        var connection = await connectionPool.getConnection();
        var [result, fields] = await connection.execute(sqls,[req.params.id]);
        connection.release()
        res.status(200).send(result);
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

router.post('/expense',async (req,res)=>{
    var sqls = "insert into petty_book (transaction_type,account,type,reason,amount,remarks,settle) values ('OUT',?,?,?,?,?,?)";
    try{
        var connection = await connectionPool.getConnection();
        await connection.execute(sqls,[req.body.account,req.body.type,req.body.reason,req.body.amount,req.body.remarks,req.body.settle]);
        connection.release()
        res.status(200).send();
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

router.post('/setoff',async (req,res)=>{
    var sqls = "insert into petty_book (transaction_type,account,reason,amount,remarks,settle) values ('IN',?,?,?,?,?)";
    try{
        var connection = await connectionPool.getConnection();
        await connection.execute(sqls,[req.body.account,req.body.reason,req.body.amount,req.body.remarks,req.body.settle]);
        connection.release()
        res.status(200).send();
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

router.post('/get-transactions',async (req,res)=>{
    //account type settled tr_type
    var conditions = [];
    var variables = [];

    if(req.body.account != "ALL" && req.body.account != ""){
        conditions = conditions.concat("account = ?")
        variables = variables.concat(req.body.account);
    }
    if(req.body.type != "ALL" && req.body.type != "" ){
        conditions = conditions.concat("type = ?")
        variables = variables.concat(req.body.type)
    }

    if(req.body.settled != "ALL" && req.body.settled != ""){
        conditions = conditions.concat("settle = ?");
        variables = variables.concat(req.body.settled);
    }

    if(req.body.tr_type != "ALL" && req.body.tr_type != ""){
        conditions = conditions.concat("transaction_type = ?")
        variables = variables.concat(req.body.tr_type);
    }

    var statement = "select petty_book.*,petty_account.name as account_name from petty_book,petty_account where petty_account.id = petty_book.account"
    var scst = ""

    if(conditions.length > 0 && conditions.length == variables.length){
        for(var i = 0 ; i < conditions.length ; i++){
            if(scst == ""){
                scst = " && "+conditions[i];
            }else{
                scst += " && "+conditions[i];
            }
        }
        statement = statement+scst;
    }
    try{
        var connection = await connectionPool.getConnection();
        var [results,fields] = await connection.execute(statement,variables);
        for(var i = 0 ; i < results.length ; i++){
            if(results[i].type != null){
                var rmd = "select * from petty_type where id = ?";
                var [resu,fiel] = await connection.execute(rmd,[results[i].type]);
                results[i].type_name = resu[0].name;
            }else{
                results[i].type_name = null;
            }
        }
        res.status(200).send(results);
        connection.release()
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

module.exports = router