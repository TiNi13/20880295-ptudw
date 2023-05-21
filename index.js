'use strict'
require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const models = require('./models');
const expressHandlebars = require('express-handlebars');
const { createStarList } = require('./controllers/handlebarsHelper');
const { createPagination } = require('express-handlebars-paginate');
const session = require('express-session');
const redisStore = require('connect-redis').default;
const { createClient } = require('redis');
const redisClient = createClient({
    url: process.env.REDIS_URL
});
redisClient.connect().catch(console.error);

// cau hinh static file
app.use(express.static(__dirname + '/public'));

app.engine('hbs', expressHandlebars.engine({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true
    },
    helpers: {
        createStarList,
        createPagination
    }
}));
app.set('view engine', 'hbs');

// Cau hinh doc du lieu tu body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Cau hinh session
app.use(session({
    secret: process.env.SESSION_SECRET,
    store: new redisStore({ client: redisClient }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 20 * 60 * 1000
    }
}));

// Middleware khoi tao gio hang
app.use((req, res, next) => {
    let Cart = require('./controllers/cart');
    req.session.cart = new Cart(req.session.cart ? req.session.cart : {});
    res.locals.quantity = req.session.cart.quantity;

    next();
});

// middleware router
const router = require('./routes/indexRouter');


app.use('/', router);
app.use('/products', require('./routes/productRouter'));
app.use('/users', require('./routes/usersRouter'));



// app.get('/createTables', (req, res) => {
//     let models.sequelize.sync()
//         .then(() => {
//             res.send('create tables success! ');
//         });
// });

// error message
app.use((req, res, next) => {
    res.status(404).render('error', {message: 'File not Found!'});
});

app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).render('error',{ message: 'Internal Server Error'});
});

// khoi tao server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
});