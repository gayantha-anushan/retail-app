const crypto = require('crypto')
const BaseData = require('./BaseData')

const password = BaseData.getMainPassword();

function encrypt(word){
    var mykey = crypto.createCipher('aes-128-cbc',password)
    var myStr = mykey.update(word,'utf8','hex')
    myStr += mykey.final('hex')
    return myStr
}

function Decrypt(word){
    var myKey = crypto.createDecipher('aes-128-cbc',password)
    var myStr = myKey.update(word,'hex','utf8')
    myStr += mykey.final('utf8')
    return myStr
}

module.exports = { encrypt,Decrypt }