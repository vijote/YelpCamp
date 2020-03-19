// Import packages
var express 		 = require('express'),
	app 			 = express(),
	bodyParser 		 = require('body-parser'),
	mongoose 		 = require('mongoose'),
	passport 		 = require('passport'),
	localStrategy 	 = require('passport-local'),
	methodOverride 	 = require('method-override'),
	flash 			 = require('connect-flash');

// Import models
var	Campground 		 = require('./models/campground'),
	Comment			 = require('./models/comment'),
	User 			 = require('./models/user'),
	seedDB 			 = require('./seeds');

// Import all routes
var campgroundRoutes = require('./routes/campground-routes'),
	commentRoutes 	 = require('./routes/comment-routes'),
	indexRoutes 	 = require('./routes/index-routes');

//seedDB(); //Seed the database

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}));
mongoose.set('useUnifiedTopology', true);
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

mongoose.connect("mongodb+srv://vijote:Vijotejaz1@yelpcamp-5z2cd.mongodb.net/yelpcamp?retryWrites=true&w=majority", { useNewUrlParser: true });

// PASSPORT CONFIG
app.use(require('express-session')({
	secret : "Foo Bar",
	resave : false,
	saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(3000, function(){
    console.log("Server has stated!");
});