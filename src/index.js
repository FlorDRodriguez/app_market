const express = require ('express');
const morgan = require ('morgan');
const path = require('path'); 
const { engine } = require('express-handlebars');
const session = require ('express-session')
const validator = require('express-validator');
const passport = require('passport');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session');

const { database } = require ('./keys');

// Intializations
const app = express();
require('./lib/passport');

// Settings
app.engine('handlebars', engine());
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(session({
  secret: 'appSession',
  resave: false,
  saveUninitialized: false,
  store: new MySQLStore(database)
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(validator());

// Global variables
app.use((req, res, next) => {
  app.locals.success = req.flash('success'); 
  app.locals.message = req.flash('message');
  app.locals.user = req.user;
  next();
}); 

// Routes
app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use('/products', require('./routes/products'));
app.use('/categories', require('./routes/categories'));

// Public
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, "public/")));
//app.use(express.static('img'));

// Starting
app.listen(app.get('port'), () => {
  console.log ('Servidor en el puerto',  app.get('port'));
}) 
