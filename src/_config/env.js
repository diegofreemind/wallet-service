require('dotenv').config();

if (!process.env.MONGO_HOST) {
    console.log('Mongo host not set');
    process.kill(1);
}

module.exports = {
    server_port: process.env.PORT,
    mongo_host: process.env.MONGO_HOST,
    mongo_extras: {
        ssl: false,
        sslValidate: false,
        sslCA: false,
        useNewUrlParser: true,
        useFindAndModify: false,
        dbName: process.env.DATABASE
    }
}