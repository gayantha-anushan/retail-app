const express = require('express')
const router = express.Router()
const BaseData = require('../BaseData')
const mysql2 = require('mysql2/promise')
const logger = require('logger').createLogger(__dirname+'/log_files/activity.txt');

var connectionPool = mysql2.createPool(BaseData.getMysqlConfig());
//
//id,name,email,address,telephone,unpaid grns,unpaid returns,pending payments,
router.get('/allstake',async (req,res)=>{
    var sqls = "select * from stakeholders where type='Suppliers'";
    try{
        var connection = await connectionPool.getConnection();
        var [results,fields] = await connection.execute(sqls);
        for(var i = 0 ; i < results.length ; i++){
            results[i].TotalAdvance = 0
            var data1 = "select sum(available) as totalavailable from advances where stake_id = "+results[i].id+"  group by stake_id";
            var [res1,fie1] = await connection.execute(data1);
            if(res1.length != 0){
                results[i].TotalAdvance = res1[0].totalavailable;
            }else{
                results[i].TotalAdvance = 0
            }
            results[i].TotalGrn = 0;
            var data2 = "select sum(total - paid) as need from grn where stakeholder = "+results[i].id+" group by stakeholder";
            var [res2,fie2] = await connection.execute(data2);
            if(res2.length == 1){
                results[i].TotalGrn = res2[0].need
            }else{
                results[i].TotalGrn = 0
            }
            results[i].totalReturn = 0
            var data3 = "select sum(grn_return_note.total - grn_return_note.completed) as need from grn_return_note,grn where grn.id = grn_return_note.grn && grn.stakeholder="+results[i].id+" group by grn.stakeholder"
            var [res3,field3] = await connection.execute(data3);
            if(res3.length > 0 ){
                results[i].totalReturn = res3[0].need;
            }else{
                results[i].totalReturn = 0
            }
        }
        connection.release();
        res.status(200).send(results);
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

//insert Advance
router.post('/adv',async (req,res)=>{
    var connection = await connectionPool.getConnection();
    var sqlm = "insert into transactions(amount,cash,bank,cheque,bankid,chequeid)values(?,?,?,?,?,?)";
    var [result,fields] = await connection.execute(sqlm,[req.body.total,req.body.cash,req.body.bank,req.body.checkam,req.body.trid,req.body.checkid]);
    var myid = result.insertId
    var sqls = "insert into advances (date,stake_id, available,total,trans_id) values (?,?,?,?,?)"
    var [result2,fields2] = await connection.execute(sqls,[req.body.date,req.body.stakeholder,req.body.total,req.body.total,myid]);
    var sqlt = "select advances.*,stakeholders.name,stakeholders.address1,stakeholders.address2,stakeholders.address3,stakeholders.email,stakeholders.telephone,transactions.amount,transactions.cash,transactions.bank,transactions.cheque,transactions.bankid,transactions.chequeid from advances,stakeholders,transactions where advances.stake_id = stakeholders.id && advances.trans_id = transactions.id && advances.id="+result2.insertId;
    var [result3,fields] = await connection.execute(sqlt);
    connection.release();
    res.status(200).send(result3[0]);
})

router.post("/credit-invoice",async (req,res)=>{
    try{
        var t = req.body.transaction;
        var i = req.body.invoice;
        var a = req.body.amount;
        var conn =await connectionPool.getConnection();
        var sqls = "insert into transactions(amount,cash,bank,cheque,bankid,chequeid)values(?,?,?,?,?,?)";
        var [resu,fields] = await conn.execute(sqls,[t.amount,t.cashamount,t.bankamount,t.chequeamount,t.banktransactionid,t.chequeNum]);
        var transid = resu.insertId;
        var sqlq = "insert into inv_trans (transaction,invoice,amount)values(?,?,?)";
        await conn.execute(sqlq,[transid,i,a]);
        var sqlr = "update invoice set creditamount = creditamount - ? where id = ?";
        await conn.execute(sqlr,[a,i]);
        res.status(200).send();
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

router.post('/credit-grn-pay',async (req,res)=>{
    try{
        var conn = await connectionPool.getConnection();
        var sqls = "insert into transactions(amount,cash,bank,cheque,bankid,chequeid)values(?,?,?,?,?,?)"
        var [result,fields] = await conn.execute(sqls,[req.body.paid,req.body.cash,req.body.bank,req.body.cheque,req.body.bankid,req.body.cheqid])
        var sqlq = "insert into grn_trans (grn,transaction,date) values (?,?,?)"
        var [resu,fie] = await conn.execute(sqlq,[req.body.id,result.insertId,req.body.date]);
        var sqrm = "update grn set paid =? where id=?"
        var [resd,fied] = await conn.execute(sqrm,[req.body.paid,req.body.id])
        conn.release()
        res.status(200).send({grnid:req.body.id,transid:result.insertId})
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

router.get('/advance/:id',async (req,res)=>{
    var sqls = "select * from advance_complete_view where id = ?";
    try{
        var connection = await connectionPool.getConnection();
        var [result,fields] = connection.execute(sqls,[req.params.id]);
        res.send(result);
        connection.release();
    }catch(error){
        logger.error(error);
        res.status(500).send()
    }
})

//View Advances
router.get('/trans',async (req,res)=>{
    var sqls = "select * from transactions";
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

router.get('/unpaid-advances-supplier/:id',async (req,res)=>{
   try{
        var sqls = "select * from advance_complete_view where type = 'Suppliers' && available != 0 && stake_id = ?";
        var connection =  await connectionPool.getConnection();
        var [result,fields] = await connection.execute(sqls,[req.params.id]);
        connection.release();
        res.status(200).send(result);
   }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

router.post('/pay-advance-grn',async (req,res)=>{
    try{
        var connection = await connectionPool.getConnection();
        var advances = req.body.advances;
        var grns = req.body.grns;
        
        if(grns.length == 1 && advances.length == 1){
            var sqla = "insert into grn_advance(grn_id,advance_id,amount)values(?,?,?)";
            var sqlb = "update advances set available = available - ? where id = ?";
            var sqlc = "update grn set paid = paid + ? where id = ?";
            if(Number(grns[0].final) > 0 && Number(advances[0].available) > 0){
                var amount = 0
                if(Number(grns[0].final) >= Number(advances[0].available)){
                    amount = advances[0].available;
                }else{
                    amount = grns[0].final;
                }
            }else if(grns[0].final < 0 && advances[0].available < 0){
                var amount = 0
                if(Number(grns[0].final) <= Number(advances[0].available)){
                    amount = advances[0].available;
                }else{
                    amount = grns[0].final;
                }
            }
            await connection.execute(sqla,[grns[0].id,advances[0].id,amount]);
            await connection.execute(sqlb,[amount,advances[0].id])
            await connection.execute(sqlc,[amount,grns[0].id])

        }else if(grns.length == 2 && advances.length == 0){
            if(Number(grns[0].final)*Number(grns[0].final) < 0){
                var positive = null;
                var negative = null;

                if(Number(grns[0].final) > 0){
                    positive = grns[0];
                    negative = grns[1];
                }else{
                    positive = grns[1];
                    negative = grns[0];
                }

                var p_n = -Number(negative.final);
                var amount  = 0;
                if(Number(positive.final) > p_n){
                    amount = p_n;
                }

                var date = new Date().toISOString().slice(0,10)
                var sqlbi = "insert into advances (date,available,total,remark)values(?,?,?,'SYSTEM_GENERATED_FOR_GRN_TALLY')";
                var [resu,fiel] = await connection.execute(sqlb,[date,0,0])
                var ids = resu.insertId;
                await connection.execute(sqla,[positive.id,ids,amount]);
                await connection.execute(sqla,[negative.id,ids,amount])

            }
        }

        res.status(200).send();
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

// router.post('/pay-advance-grn',async (req,res)=>{
//     try{
//         var connection =  await connectionPool.getConnection()

//         var mxadv = advances.length ;
//         var ongoingGrn = 0;
//         var ongoingAdv = 0;
//         for(var i = 0 ; i < grns.length ; i++){
//             var unsuccess = true;
//             var need_to_pay = Number(grns[i].final) - Number(grns[i].paid)
//             while(unsuccess){
//                 if(Number(need_to_pay) < Number(advances[ongoingAdv].available)){
//                     var sqla = "insert into grn_advance(grn_id,advance_id,amount)values(?,?,?)";
//                     var sqlb = "update advances set available = available - ? where id = ?";
//                     var sqlc = "update grn set paid = paid + ? where id = ?";
//                     await connection.execute(sqla,[grns[i].id,advances[ongoingAdv].id,need_to_pay]);
//                     await connection.execute(sqlb,[need_to_pay,advances[ongoingAdv].id]);
//                     await connection.execute(sqlc,[need_to_pay,grns[i].id]);
//                     advances[ongoingAdv].available -= Number(need_to_pay)
//                     unsuccess = false;
//                 }else if(Number(need_to_pay) > Number(advances[ongoingAdv].available)){
//                     var sqla = "insert into grn_advance(grn_id,advance_id,amount)values(?,?,?)";
//                     var sqlb = "update advances set available = 0 where id = ?";
//                     var sqlc = "update grn set paid = paid + ? where id = ?";
//                     await connection.execute(sqla,[grns[i].id,advances[ongoingAdv].id,advances[ongoingAdv].available]);
//                     await connection.execute(sqlb,[advances[ongoingAdv].id]);
//                     await connection.execute(sqlc,[advances[ongoingAdv].available,grns[i].id]);
//                     need_to_pay -= Number(advances[ongoingAdv].available);
//                     ongoingAdv ++;
//                     unsuccess = true;
//                 }else{
//                     var sqla = "insert into grn_advance(grn_id,advance_id,amount)values(?,?,?)";
//                     var sqlb = "update advances set available = 0 where id = ?";
//                     var sqlc = "update grn set paid = paid + ? where id = ?";
//                     await connection.execute(sqla,[grns[i].id,advances[ongoingAdv].id,need_to_pay]);
//                     await connection.execute(sqlb,[advances[ongoingAdv].id]);
//                     await connection.execute(sqlc,[need_to_pay,grns[i].id]);
//                     ongoingAdv++;
//                     unsuccess = false;
//                 }
//                 if(ongoingAdv == mxadv ){
//                     unsuccess=false;
//                 }
//             }
//             if(ongoingAdv == mxadv && Number(advances[ongoingAdv].available) == 0){
//                 break;
//             }
//         }
//         connection.release();
//         res.status(200).send();
//     }catch(error){
//         logger.error(error);
//         res.status(500).send();
//     }
// })

router.get('/adv-by-stake/:stake',async (req,res)=>{
    var sqls = "select * from advances where stake_id = ?";
    try{
        var connection = await connectionPool.getConnection();
        var [result,field] = await connection.execute(sqls,[req.params.stake]);
        res.status(200).send(result);
        connection.release()
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

router.get('/credited-invoices',async (req,res)=>{
    var sqls = "select * from invoice,stakeholders where stakeholders.id = invoice.customer &&  invoice.creditamount > 0";
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

router.get('/advance-list/:id',async (req,res)=>{
    var sqls = "select * from advance_complete_view where type =?";
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

module.exports = router;