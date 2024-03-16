import express from 'express'
import history from 'connect-history-api-fallback'

const app = express();

app.use(history({
    verbose:true
}))

app.use(express.static(__dirname+'/public/'));

app.listen(3000,()=>{
    return console.log("Application Started!")
})