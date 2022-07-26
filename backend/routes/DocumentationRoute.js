const express = require('express')
const router = express.Router()
const BaseData = require('../BaseData')
const mysql2 = require('mysql2/promise');
const LoginFunctions = require('../functions/LoginFunctions');
const logger = require('logger').createLogger(__dirname+'/log_files/activity.txt');
var config = BaseData.getMysqlConfig()

var connectionPool = mysql2.createPool(BaseData.getMysqlConfig());

router.get('/all',async (req,res)=>{
    try{
        var connection = await connectionPool.getConnection();
        var sqls = "select grn.*,stakeholders.name,stakeholders.address1,stakeholders.address2,stakeholders.address3,stakeholders.email,stakeholders.telephone from grn LEFT JOIN stakeholders ON grn.stakeholder = stakeholders.id"
        var [result,schema] = await connection.execute(sqls);
        connection.release();
        res.status(200).send(result);
    }catch(error){
        logger.error(error);
        res.status(500).send(error);
    }
})

router.get('/grn-details/:id',async (req,res)=>{
    try{
        var connecton = await connectionPool.getConnection();
        var sqls = "select grn.*,stakeholders.id as st_id,stakeholders.name as st_name, stakeholders.address1,stakeholders.address2,stakeholders.address3,stakeholders.email,stakeholders.telephone from grn left join stakeholders on grn.stakeholder = stakeholders.id where grn.id = ?";
        var [result,schema] = await connecton.execute(sqls,[req.params.id])
        var sqlq = "select  grn_items.*,items.code,items.name,items.unit from grn_items,items where items.id = grn_items.item && document = ?"
        var [resu,sche] = await connecton.execute(sqlq,[req.params.id])
        connecton.release();
        res.status(200).send({grn:result[0],items:resu});
    }catch(error){
        logger.error(error);
        res.status(500).send(error);
    }
})

router.get('/calc-vats/:type',async(req,res)=>{
    try{
        var connection = await connectionPool.getConnection();
        var sqls = "select id,percentage from vats where action='Calculate' && active=1 && invoice=?"
        var [result,fields] = await connection.execute(sqls,[req.params.type]);
        connection.release();
        res.status(200).send(result);
    }catch(error){
        logger.error(error);
        res.status(500).send();
    }
})

router.get('/final-grn-details/:id',async (req,res)=>{
    try{
        var connecton = await connectionPool.getConnection();
        var sqls = "select grn.*,stakeholders.id as st_id,stakeholders.name as st_name, stakeholders.address1,stakeholders.address2,stakeholders.address3,stakeholders.email,stakeholders.telephone from grn left join stakeholders on grn.stakeholder = stakeholders.id where grn.id = ?";
        var [result,schema] = await connecton.execute(sqls,[req.params.id])
        if(result.length == 1){
            var sqqq = "select total,discounted_amount,vat_amount,final from grn_return_note where grn = ?";
            var [rems,fems] = await connecton.execute(sqqq,[req.params.id]);
            if(rems.length > 0){
                var allTotals = 0;
                var allVatAmounts = 0;
                var allDiscountAmounts = 0
                var allFinals = 0
                for(var i = 0 ; i < rems.length ; i++ ){
                    allTotals += Number(rems[i].total);
                    allVatAmounts += Number(rems[i].vat_amount);
                    allDiscountAmounts += Number(rems[i].discounted_amount);
                    allFinals += Number(rems[i].final);
                }
                result[0].total -= allTotals;
                result[0].vat_amount -= allVatAmounts;
                result[0].disc_amount -= allDiscountAmounts;
                result[0].final -= allFinals;
            }
            var sqlq = "select  grn_items.*,items.code,items.name,items.unit from grn_items,items where items.id = grn_items.item && document = ?"
            var [resu,sche] = await connecton.execute(sqlq,[req.params.id])
            var sqlr = "select * from returned_grn_items_view where grn = ?";
            var [resuu,schee] = await connecton.execute(sqlr,[req.params.id]);
            for(var i = 0 ; i < resuu.length ; i++){
                var place = -1;
                for(var j = 0 ; j < resu.length ; j++){
                    if(resu[j].item == resuu[i].item){
                        place = j;
                    }
                }
                resu[place].quantity = resu[place].quantity - resuu[i].quantity
                resu[place].total = resu[place].total - resuu[i].total
                resu[place].final = resu[place].final - resuu[i].final
            }
            res.status(200).send({grn:result[0],items:resu});
            connecton.release();
        }else{
            res.status(400).send("Error")
        }
    }catch(error){
        logger.error(error);
        res.status(500).send(error);
    }
})


router.post('/doc',async (req,res)=>{
    try{
        var connection = await connectionPool.getConnection();
        //insert grn
        var sqls = "insert into grn(rec_date,ent_date,orders,type,stakeholder,invoice,reference,payment_term,total,vat_percentage,discount,vat_amount,disc_amount,final,remarks,user) values (?,?,?,'Normal',?,?,?,?,?,?,?,?,?,?,?,?)";
        var usu = await LoginFunctions.GetIDFromToken(req.body.user)
        var [result,fields] = await connection.execute(sqls,[req.body.received,req.body.entered,req.body.prevdoc,req.body.stakedoc,req.body.invoice,req.body.reference,req.body.payment_term,req.body.total,req.body.vat_persent,req.body.disc_persent,req.body.vat_amount,req.body.desc_amount,req.body.final,req.body.remarks,usu]);
        var gres = result;
        for(var i = 0 ; i < req.body.items.length ; i++){
            var sqlm = "insert into grn_items(item,document,quantity,unit_price,discount,total,final)values(?,?,?,?,?,?,?);"
            await connection.execute(sqlm,[req.body.items[i].id,gres.insertId,req.body.items[i].quantity,req.body.items[i].unitprice,req.body.items[i].discount,req.body.items[i].total,req.body.items[i].final]);
            if(req.body.prevdoc != null){
                var sqn = "update items set orders = orders - ?,quantity = quantity + ? where id = ?;"
                await connection.execute(sqn,[req.body.items[i].quantity,req.body.items[i].quantity,req.body.items[i].id]);
            }else{
                var sqn = "update items set quantity = quantity + ? where id = ?;"
                await connection.execute(sqn,[req.body.items[i].quantity,req.body.items[i].id]);
            }
            var newup = Number(req.body.items[i].final)/Number(req.body.items[i].quantity)
            var sqf = "insert into bin_card (date,item,in_quantity,in_up,in_total,type,GRN)values(?,?,?,?,?,'GRN',?)";
            await connection.execute(sqf,[req.body.entered,req.body.items[i].id,req.body.items[i].quantity,newup,req.body.items[i].final,gres.insertId])
            if(req.body.prevdoc != null){
                var squ = "Update purchase_order_items set sucess = sucess + ? where item = ? && document = ?";
                await connection.execute(squ,[req.body.items[i].quantity,req.body.items[i].id,req.body.prevdoc]);
            }
        }
        connection.release();
        res.status(200).send(result)
    }catch(error){
        logger.error(error);
        res.status(500).send(error);
    }
})

router.get('/credited-grn',async (req,res)=>{
    var sqls = "select grn.*,stakeholders.name as name,stakeholders.address1 as address1,stakeholders.address2 as address2,stakeholders.address3 as address3 from grn,stakeholders where grn.stakeholder = stakeholders.id && grn.total > grn.paid"
    try{
        var connection = await connectionPool.getConnection();
        var [resu,fiel] = await connection.execute(sqls)
        connection.release();
        res.status(200).send(resu);
    }catch(error){
        logger.error(error)
        res.status(400).send(error)
    }
})
 
router.get('/unpaid-grns/:id',async (req,res)=>{
    try{
        var connection = await connectionPool.getConnection();
        var sqls = "select grn.id,ent_date as date,grn.final as grn_final,sum(grn_return_note.final) as total_returns,grn.paid as paid_yet, grn.final - sum(grn_return_note.final) - grn.paid as final from grn,grn_return_note where grn.id = grn_return_note.id && grn.stakeholder = ? group by grn_return_note.grn";
        var [results,schema] = await connection.execute(sqls,[req.params.id]);
        connection.release();
        res.status(200).send(results);
    }catch(error){
        logger.error(error)
        res.status(400).send(error)
    }
})


module.exports = router