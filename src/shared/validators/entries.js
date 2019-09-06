function checkIsNotNull(...args) {

    args.forEach(param => {

        let key = Object.keys(param)[0];
        let value = Object.values(param)[0];

        if (!value) {
            throw new Error(`The argument ${key} is invalid: ${value}`);
        }
    });

    return true;
}

module.exports = {
    checkIsNotNull
}