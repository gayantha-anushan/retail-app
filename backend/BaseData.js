
function getMainPassword(){
    return "shojikinaseiko"
}
function getMysqlConfig(){
    var conf = {
        host:'34.121.0.150',
        port:3306,
        user:'demo-pos',
        password:'pos@demo',
        database:'dev_db'
    }
    return conf;
}

module.exports = {getMainPassword,getMysqlConfig} 
