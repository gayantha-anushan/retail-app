const express = require('express')
const router = express.Router()
const BaseData = require('../BaseData')
const logger = require('logger').createLogger(__dirname+'/log_files/activity.txt');
const mysql2 = require('mysql2/promise');
const LoginFunctions = require('../functions/LoginFunctions');

var connectionPool = mysql2.createPool(BaseData.getMysqlConfig());

router.post('/create-vat',async (req,res)=>{
    var sqls = "insert into vats (name,percentage,invoice,action) values (?,?,?,?)";
    try{
        var connection = await connectionPool.getConnection();
        await connection.execute(sqls,[req.body.name,req.body.percentage,req.body.invoice,req.body.acton]);
        res.status(201).send();
        connection.release();
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})
router.get('/vat-by-invoive/:type',async (req,res)=>{
    var sqls = "select * from vats where invoice = ?";
    try{
        var connection = await connectionPool.getConnection();
        var [result,field] = await connection.execute(sqls,[req.params.type]);
        res.status(200).send(result);
        connection.release();
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})
router.get('/allvats',async (req,res)=>{
    var sqls = "select * from vats";
    try{
        var connection = await connectionPool.getConnection();
        var [result,field] = await connection.execute(sqls);
        res.status(200).send(result);
        connection.release();
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

router.get('/start-vat/:id',async (req,res)=>{
    try{
        var connection = await connectionPool.getConnection();
        await connection.execute("update vats set active = 1 where id = ?",[req.params.id]);
        connection.release();
        res.status(200).send()
    }catch(error){
        logger.log(error)
        res.status(500).send()
    }
})

router.delete('/vat/:id',async (req,res)=>{
    var sqls = "update vats set active=0 where id = ?";
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

// router.post('/get_from_advance',async (req,res)=>{
//     try{
//         var sqls = "select * from advances;"
//         var rs= await con.query(sqls);
//         res.send(rs)
//     }catch(error){
//         logger.error(error);
//         res.status(500).send();
//     }
// })

router.post('/create-invoice',async (req,res)=>{
    try{
        var connection = await connectionPool.getConnection();

        var ad = req.body.advances;

        var sqli = "insert into transactions (amount, cash,bank,cheque,bankid,chequeid) values ("+req.body.paid+","+req.body.cash+","+req.body.bank+","+req.body.cheq+",'"+req.body.bank_id+"','"+req.body.cheq_id+"');";
        var [result,fields] = await connection.execute(sqli)
        var trid = result.insertId;

        if(ad.length > 0){
            for(var i = 0 ; i < ad.length ; i++){
                s = "update advances set available = available - "+ad[i].use_amount+" where id = "+ad[i].id;
                s2 = "insert into advance_trans (transid,advanceid,usedamount) values ("+trid+","+ad[i].id+","+ad[i].use_amount+");"
                await connection.execute(s);
                await connection.execute(s2);
            }
        }
        if(req.body.ord != null){
            var ids = req.body.ord.id
        }else{
            var ids = null;
        }
        if(req.body.cust == ""){
            var cst = null;
        }else{
            var cst = req.body.cust;
        }
        var ussr =await LoginFunctions.GetIDFromToken(req.body.user)
        var sqq = "insert into invoice (type,date,customer,creditamount,prevdoc,total,discount,final,remarks,user) values (?,?,?,?,?,?,?,?,?,?)";
        var [r,f] =await  connection.execute(sqq,[req.body.type,req.body.date,cst,req.body.credit,ids,req.body.total,req.body.disc,req.body.final,req.body.rem,ussr]);
        var inid = r.insertId;
        var ilist = req.body.addedItems
        for(var j = 0 ; j < ilist.length ; j++){
            srk = "insert into invoice_items (item,document,quantity,unit_price,discount,total,final) values (?,?,?,?,?,?,?);"
            srk2 = "update items set quantity = quantity - ? where id = ?;";
            var nup = Number(ilist[j].final)/Number(ilist[j].quantity)
            var bin_data = "select sum(in_quantity - out_quantity) as total_quantity,sum(in_total -out_total) as total_cost from bin_card where item = ?";
            var [rms,fms] = await connection.execute(bin_data,[ilist[j].id]);
            if(rms.length > 0){
                var avg = Number(rms[0].total_cost) / Number(rms[0].total_quantity)
                var total_item_value = Number(avg) * Number(ilist[j].quantity);
                srk3 = "insert into bin_card(date,item,out_quantity,out_up,out_total,type,INV)values(?,?,?,?,?,'INVOICE',?)"
                await connection.execute(srk3,[req.body.date,ilist[j].id,ilist[j].quantity,avg,total_item_value,inid]);
            }
            await connection.execute(srk,[ilist[j].id,inid,ilist[j].quantity,ilist[j].unit_price,ilist[j].discount,ilist[j].total,ilist[j].final]);
            await connection.execute(srk2,[ilist[j].quantity,ilist[j].id]);
        }
        var sc = "select * from vats where active = 1 && invoice = ?";
        var [rej,fej] = await connection.execute(sc,[req.body.type]);
        if(rej.length > 0 ){
            for(var t = 0 ; t < rej.length ; t++){
                qq = "insert into invoice_vat (invoice,vat) values (?,?);";
                await connection.execute(qq,[inid,rej[t].id]);
            }
        }
        connection.release();
        res.status(200).send([r]);
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

router.get('/all',async (req,res)=>{
    var sqls = "select invoice.*,stakeholders.id as stid,stakeholders.name as name,stakeholders.address1 as address1,stakeholders.address2 as address2, stakeholders.address3 as address3, stakeholders.email as email, stakeholders.telephone as telephone from invoice left join stakeholders on invoice.customer = stakeholders.id";
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

router.get('/calculated-vats/:type',async (req,res)=>{
    var sqls = "select percentage from vats where invoice=? && action='Calculate' && active=1";
    try{
        var connection = await connectionPool.getConnection();
        var [result,fields] =await connection.execute(sqls,[req.params.type])
        res.send(result);
        connection.release();
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

router.get('/invoice/:id',async (req,res)=>{
    var sqls = "select * from invoice where id = ?";
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

router.get('/invitems/:id',async (req,res)=>{
    var sqls = "select distinct invoice_items.*,items.name,items.description,items.unit,items.type from invoice_items,items where invoice_items.item = items.id  and invoice_items.document = ?";
    try{
        var connection = await connectionPool.getConnection();
        var [result,fields] =await connection.execute(sqls,[req.params.id])
        res.send(result);
        connection.release();
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
});

router.get('/inv-vats/:id',async (req,res)=>{
    var sqls = "select vats.* from vats,invoice_vat where vats.id = invoice_vat.vat && invoice_vat.invoice = ?";
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

router.get('/all-invoice-details/:id',async (req,res)=>{
    try{
        var sqls = "select * from invoice where id=?";
        var sqlq = "select vats.name,vats.percentage,vats.action from invoice_vat,vats where vats.id = invoice_vat.vat && invoice_vat.invoice=?";
        var sqi = "select items.id,items.code,items.name,items.description,items.unit,invoice_items.quantity,invoice_items.unit_price,invoice_items.discount,invoice_items.total,invoice_items.final from invoice_items,items where items.id = invoice_items.item && invoice_items.document = ?"
        var connection = await connectionPool.getConnection();
        var [rs1,f1] = await connection.execute(sqls,[req.params.id]);
        var [rs2,f2] = await connection.execute(sqlq,[req.params.id]);
        var [rs3,f3] = await connection.execute(sqi,[req.params.id]);
        var hasinvoice = false;
        if(rs1.length > 0){
            hasinvoice = true;
        }
    
        res.status(200).send({status:hasinvoice,invoice:rs1[0],vats:rs2,items:rs3});
        connection.release();
    }catch(error){
        logger.error(error)
        res.status(500).send();
    }
})

router.get('/all-final-invoice-details/:id',async (req,res)=>{
    try{
        var sqls = "select * from invoice where id=?";
        var sqlq = "select vats.name,vats.percentage,vats.action from invoice_vat,vats where vats.id = invoice_vat.vat && invoice_vat.invoice=?";
        var sqi = "select items.id,items.code,items.name,items.description,items.unit,invoice_items.quantity,invoice_items.unit_price,invoice_items.discount,invoice_items.total,invoice_items.final from invoice_items,items where items.id = invoice_items.item && invoice_items.document = ?"
        var sqlb = "select * from returned_invoice_item_view where invoice=?";
        var connection = await connectionPool.getConnection();
        var [rs1,f1] = await connection.execute(sqls,[req.params.id]);
        var [rs2,f2] = await connection.execute(sqlq,[req.params.id]);
        var [rs3,f3] = await connection.execute(sqi,[req.params.id]);
        var [rs4,f4] = await connection.execute(sqlb,[req.params.id]);

        for(var i = 0 ; i < rs4.length ; i++){
            var place = -1;
            for(var j = 0 ; j < rs3.length ; j++){
                if(rs3[j].id == rs4[i].item_id){
                    place = j;
                    break;
                }
            }
            rs3[place].quantity -= rs4[i].quantity;
            rs3[place].total -= rs4[i].total;
            rs3[place].final -= rs4[i].final;
        }

        var hasinvoice = false;
        if(rs1.length > 0){
            hasinvoice = true;
        }
    
        res.status(200).send({status:hasinvoice,invoice:rs1[0],vats:rs2,items:rs3});
        connection.release();
    }catch(error){
        logger.error(error)
        res.status(500).send();
    }
})

//All functions are success and tested by postman
module.exports = router;
//248