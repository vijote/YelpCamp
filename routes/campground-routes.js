var express 	= require('express'),
	router 		= express.Router({mergeParams : true}),
	Campground 	= require('../models/campground'),
	middleware 	= require('../middleware');

// INDEX ROUTE
router.get('/', function(req, res){
    Campground.find({}, function(err, allCamps){
		if(err){
			console.log(err);
		} else {
			res.render('campgrounds/index', {campgrounds : allCamps});
		}
	})
});

// CREATE ROUTE
router.post('/', middleware.isLoggedIn,  function(req, res){
    var name 		= req.body.name;
	var image 		= req.body.image;
	var price 		= req.body.price;
	var description = req.body.description;
	var author 		= {
					  id: req.user._id,
					  username : req.user.username
	}

    var newCamp = {
        name : name,
        image : image,
		description : description,
		author : author,
		price : price
    };
    Campground.create(newCamp, function(err, createdCamp){
		if(err){
			console.log(err);
		}
		else{
			console.log(createdCamp);
			res.redirect('/campgrounds');
		}
	});
});

// NEW ROUTE
router.get('/new', middleware.isLoggedIn,  function(req, res){
    res.render('campgrounds/new');
})

// SHOW ROUTE
router.get('/:id', function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
		if(err || !foundCamp){
			req.flash('error', 'Campground not found');
			res.redirect('back');
		} else{
			console.log(foundCamp);
			res.render('campgrounds/show', {campground : foundCamp});
		}
	});
});

// EDIT ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCamp){
		res.render('campgrounds/edit', {campground : foundCamp});
	});
});

// UPDATE ROUTE
router.put('/:id', middleware.checkCampgroundOwnership, function(req,res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCamp){
		if(err){
			res.redirect('/campgrounds');
		} else{
			res.redirect('/campgrounds/' + req.params.id);
		};
	});
});

// DELETE ROUTE
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect('/campgrounds');
		} else {
			res.redirect('/campgrounds');
		}
	})
})

module.exports = router;