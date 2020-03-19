var passport 	= require('passport'),
	express = require('express'),
	router 	= express.Router({mergeParams : true}),
	User 	= require('../models/user');
	

// ROOT ROUTE
router.get('/', function(req, res){
    res.render('landing');
});

// ================ AUTH ROUTES ================

// SHOW Register form route
router.get('/register', function(req, res){
	res.render('register');
});

//POST the new user
router.post('/register', function(req, res){
	var newUser = new User({username : req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
				req.flash('error', err.message);
				return res.redirect('register');
		}
		passport.authenticate('local')(req, res, function(){
			req.flash('success', 'Welcome to Yelpcamp!');
			res.redirect("/campgrounds");
		});
	});
});

// SHOW Login form
router.get('/login', function (req, res){
	res.render('login');
});

//
router.post('/login', passport.authenticate('local', {
	successRedirect : '/campgrounds',
	failureRedirect : '/login'
}), function(req, res){
	res.send('Logged in!');
});

router.get('/logout', function(req, res ){
	req.logout();
	req.flash('success', 'Logged out. See you!')
	res.redirect('campgrounds');
});

module.exports = router;
