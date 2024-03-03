const path = require('path');

module.exports = {
    development:{
        client:'mysql2',
        // connection:{
        //     host:'sql6.freemysqlhosting.net',
        //     port:3306,
        //     user:'sql6475567',
        //     password:'5tiPGZw5Bn',
        //     database:'sql6475567'
        // },
        connection:{
            host:'34.121.0.150',
            port:3306,
            user:'demo-pos',
            password:'pos@demo',
            database:'dev_db'
        },
        useNullAsDefault:true,
        migrations:{
            directory:path.join(__dirname,"db/migrations")
        },
        seeds:{
            directory:path.join(__dirname,"db/seeds")
        }
    }
}