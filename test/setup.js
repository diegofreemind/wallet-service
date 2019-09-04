const { connect, connection, disconnect } = require('mongoose');
const { mongo_host } = require('../components/_config/env');
require('../components/Schedule/ScheduleModel');

beforeEach(function (done) {
    /*
      Define clearDB function that will loop through all 
      the collections in our mongoose connection and drop them.
    */
    function clearDB() {
        for (var i in connection.collections) {
            connection.collections[i].remove(function () { });
        }
        return done();
    }

    if (connection.readyState === 0) {
        connect(
            mongo_host,
            function (err) {
                if (err) {
                    throw err;
                }
                return clearDB();
            }
        );
    } else {
        return clearDB();
    }
});

afterEach(function (done) {
    disconnect();
    return done();
});

afterAll(done => {
    return done();
});