
function getMainPassword(){
    return "shojikinaseiko"
}
function getMysqlConfig(){
    // var conf =  {
    //     host:'mysql-52827-0.cloudclusters.net',
    //     port:14861,
    //     user:'admin',
    //     password:'NQamkDsh',
    //     database:'pos'
    // }
    // var conf = {
    //     host:'sql6.freemysqlhosting.net',
    //     port:3306,
    //     user:'sql6475567',
    //     password:'5tiPGZw5Bn',
    //     database:'sql6475567'
    // }
    var conf = {
        host:"localhost",
        user:"root",
        password:"gayanu.amb",
        database:"pos8"
    }
    return conf;
}

module.exports = {getMainPassword,getMysqlConfig} 
