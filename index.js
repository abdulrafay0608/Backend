const express = require('express');
const cookieparser = require('cookie-parser');
const expressSession = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const app = express();
const productModel = require('./config/mongoose-connection');
const ownerRouter = require('./routes/ownerRouter');
const userRouter = require('./routes/userRouter');
const productRouter = require('./routes/productRouter');    
const indexRouter = require('./routes/indexRouter');

require("dotenv").config();

const port = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: "ahsan"
}));
app.use(flash());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieparser());
app.use(express.static('public'));

app.use('/', indexRouter);
app.use('/owner', ownerRouter);
app.use('/users', userRouter);
app.use('/product', productRouter);

app.get('/', function (req, res) {
    res.send('44444');
});

app.listen(port, () => {
    console.log(`Your server is running on port ${port}`);
});
process.on('uncaughtException', (err) => {
    console.error('There was an uncaught error:', err);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
