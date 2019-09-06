const passport = require('passport');
const appId = require("ibmcloud-appid");
const APIStrategy = appId.APIStrategy;

module.exports = {
    authenticate: () => {
        return passport.authenticate(APIStrategy.STRATEGY_NAME, { session: false });
    }
}