const app = require('./index');

app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
});

module.exports = app;