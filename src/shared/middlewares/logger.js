const Morgan = require('morgan');
const Winston = require('winston');

const winston = Winston.createLogger({
    transports: [
        new Winston.transports.Console({
            json: false,
            level: 'info',
            colorize: true,
            handleExceptions: true
        })
    ]
});

winston.stream = {
    write: function (message) {
        winston.info(message);
    }
};

const morgan = Morgan('combined', {
    stream: winston.stream,
    skip: (req, res) => { return res.statusCode < 400 }
})

module.exports = morgan;