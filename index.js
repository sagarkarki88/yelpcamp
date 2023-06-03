if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}


const express = require('express')
const app = express()
const helmet = require('helmet')

const mongoose = require('mongoose')
const path = require('path')
const ejsEngine = require('ejs-mate');// adding dynamic content with boilerplate 
const methodOverride = require('method-override')
const Users = require('./models/users')
//passport 
const userRoutes = require('./routers/users.js')
const passport = require('passport');
const localStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize'); // securing mongo Injection

/* const {campgroundJoiSchema, reviewJoiSchema} = require('./valSchema.js')
 */

//express router
const campgroundRoutes = require('./routers/campground');
const reviewRoutes = require('./routers/review');

//sesssions
const session = require('express-session');
//flash
const flash = require('connect-flash');
app.use(flash());
app.set('view engine', 'ejs')
app.set('views',path.join(__dirname,'views'))

app.use(express.urlencoded({extended:true})) /* whnever we parse POST request */
app.use(methodOverride('_Method'));
/* app.use((req,res,next)=>{
    console.log('Time:', Date.now())
    next()
}) */
app.use(express.static(path.join(__dirname,'public')));
app.use(mongoSanitize());

app.engine('ejs',ejsEngine);
//mongodb://localhost:27017/yelp-camp //development database
//const dbURL = process.env.DB_URL
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

  /* alternative to mongoose.connection */
    /*  .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    }) */

const db = mongoose.connection;
db.on("error", console.error.bind(console,"conection error:"));
db.once("open",()=>{
    console.log("database Connected")
})

/* testing custom middle ware to protect a route */
function verifyPassword(req,res,next){
    const {password} = req.query;
    if(password === 'hello'){
        next();
    }
    else{
        res.send("Passowrd didnt match");
    }
} 
const MongoStore = require('connect-mongo');
const dbURL = 'mongodb://localhost:27017/yelp-camp'
const sessionConfig  = {
    name:'sessionId',
    secret: 'notanactaulsecret',
    resave : false,
    saveUninitialized: true,
    cookie: {
        httpOnly:true,
       // secure:true, //cookies to be changed to only if secured.
        expires: Date.now() + 1000*60*60*24*7,
        maxAge:1000 * 60 * 60 * 24 * 7
    },
    store:  MongoStore.create(
        { 
        mongoUrl: dbURL,
        touchAfter: 24 * 3600,
        autoRemove: 'native',
        secret: 'notsoverysecret'
        })
}
app.use(session(sessionConfig));
app.use(helmet())


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dzhhytlb2/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://source.unsplash.com/collection/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());


//global variables to templates // available to all templates
app.use((req,res,next)=>{
    res.locals.success =  req.flash('success')
    res.locals.deleted = req.flash('deleted')
    res.locals.updateSuccess = req.flash('updateSuccess')
    res.locals.error = req.flash('error')
    res.locals.reviewAdd = req.flash('reviewFlashAdd')
    res.locals.reviewDelete = req.flash('reviewDelete')

    res.locals.notfound = req.flash('resourceNotFound')
    res.locals.currentUser = req.user
    next()
})

app.get('/',(req,res)=>{
    res.render('home')
})
app.get('/home',(req,res)=>{
    res.render('home')
})

app.get('/secret',(req,res)=>{
    if(!req.isAuthenticated()) res.send("please login")
    res.send("secret revealed")
})

app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes);
app.use('/',userRoutes);

app.use((req,res,next)=>{
    res.status(404).send('NOT FOUND:404 - The resources you are looking for does not Exist try again')
    next()
})


/* Error to handle custom error thrown from any routes and logic error such as 'not defined' */
/* app.use((err,req,res,next) => {
    console.log("console log from appuse error handling middleware gang of 4")
    res.status(405).send("Error occured type 405 please try again later")
    next(err);
}) */

app.use((err,req,res,next)=>{
    const {statusCode=500} = err;
    if(!err.message) err.message = "something went wrong"
    res.status(statusCode).render('error',{err});
})

app.listen('3000',()=>{
    console.log("Listening at 3000")
})