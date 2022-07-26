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
    var sqls = "Insert into main_account (code,name) values (?,?)"
    try{
        var connection = await connectionPool.getConnection();
        await connection.execute(sqls,[req.body.code,req.body.name])
        connection.release()
        res.status(200).send();
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})


router.post('/create-type',async (req,res)=>{
    //name account
    var sqls = "insert into main_types (account_id,name) values(?,?)"
    try{
        var connection = await connectionPool.getConnection();
        await connection.execute(sqls,[req.body.account,req.body.name]);
        connection.release()
        res.status(200).send();
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

router.get('/all-accounts',async (req,res)=>{
    var sqls = "select * from main_account";
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
    var sqls = "select * from main_types where main_types.account_id = ?";
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
    var sqls = "insert into main_transes (date,account,type,description,amount,completed,remarks) values (?,?,?,?,?,0.00,?)";
    try{
        var connection = await connectionPool.getConnection();
        await connection.execute(sqls,[req.body.date,req.body.account,req.body.type,req.body.description,req.body.amount,req.body.remarks]);
        connection.release();
        res.status(200).send();
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

router.post('/setoff',async (req,res)=>{
    var sqls = "insert into transactions (amount,cash,bank,cheque,bankid,chequeid) values (?,?,?,?,?,?)";
    var sqlt = "insert into main_trans_transactions (date,main_trans_id,transaction_id) values (?,?,?)";
    var sqlu = "update main_transes set completed = completed + ? where id = ?";
    try{
        var connection = await connectionPool.getConnection();
        var [result,field] = await connection.execute(sqls,[req.body.amount,req.body.cash,req.body.bank,req.body.cheque,req.body.bankid,req.body.chequeid]);
        await connection.execute(sqlt,[req.body.date,req.body.main_trans,result.insertId])
        await connection.execute(sqlu,[req.body.amount,req.body.main_trans])
        connection.release();
        res.status(200).send();
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})


router.post('/get-transactions',async (req,res)=>{
    var conditions = [];
    var variables = [];

    if(req.body.account != "ALL" && req.body.account != ""){
        conditions = conditions.concat("main_transes.account = ?")
        variables = variables.concat(req.body.account);
    }
    if(req.body.type != "ALL" && req.body.type != "" ){
        conditions = conditions.concat("main_transes.type = ?")
        variables = variables.concat(req.body.type)
    }

    if(req.body.status == "completed"){
        conditions = conditions.concat("amount = completed")
    }else if(req.body.status == "not completed"){
        conditions = conditions.concat("amount > completed")
    }

    var statement = "select main_transes.*,main_account.name as account_name,main_types.name as type_name from main_transes,main_account,main_types where main_transes.account = main_account.id && main_transes.type = main_types.id "
//     var statement = "select petty_book.*,petty_account.name as account_name from petty_book,petty_account where petty_account.id = petty_book.account"
    var scst = ""

    if(conditions.length > 0 ){
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
        res.status(200).send(results);
        connection.release()
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

module.exports = router