const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const history = require('connect-history-api-fallback')
const fileUpload = require('express-fileupload')

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload())
app.use(cookieParser())
app.use(cors())

var port = process.env.PORT || 3000;

var usrs = require('./routes/UserRoute.js')
var items = require('./routes//ItemManage.js')
var sholders = require('./routes/StakeRoute.js')
var Settings = require('./routes/SettingRoute');
var Documentation = require('./routes/DocumentationRoute');
var Orders = require('./routes/OrderRoute');
var InvoiceRoute = require('./routes/InvoiceRoute')
var ItemRequestRoute = require('./routes/ItemRequestRoute')
var ItemReturnRoute = require('./routes/ItemReturnRoute')
var Payment = require('./routes/Payments')
var ReportRoute = require('./routes/ReportRoute')
var PettyCash = require('./routes/PettyCashRoute')
var MainExpense = require('./routes/MainExpenseRoute')

app.use('/api/ireq',ItemRequestRoute)
app.use('/api/users',usrs)
app.use('/api/petty',PettyCash)
app.use('/api/items',items)
app.use('/api/stake',sholders)
app.use('/api/setting',Settings)
app.use('/api/doc',Documentation)
app.use('/api/orders',Orders)
app.use('/api/invoice',InvoiceRoute)
app.use('/api/return',ItemReturnRoute)
app.use('/api/pay',Payment)
app.use('/api/report',ReportRoute)
app.use('/api/mainex',MainExpense)

app.use(history({
    verbose:true
}))

app.use(express.static(__dirname+'/public/'));

app.listen(port,()=>{
    console.log('Application Running in port : ' + port);
});