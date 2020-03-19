var middleware = {},
    Campground = require('../models/campground');
    Comment = require('../models/comment');

middleware.checkCampgroundOwnership = function(req, res, next){
    // if user is logged in
    if(req.isAuthenticated()){
		//then search the requested camp
		Campground.findById(req.params.id, function(err, foundCamp){
			// if there's error then go back
			if(err || !foundCamp){
				req.flash('error', 'Campground not found!');
				res.redirect('back');
			} 
			// else check if user owns the found camp
			else{
				if(foundCamp.author.id.equals(req.user._id)){
					// if camp's id and user's id match then do next
					next();
				} else {
					req.flash("You don't have permission to do that!");
					res.redirect('back');
				}
				
			};
		});
	} else {
		req.flash('error', "You need to be logged in to do that!");
		res.redirect('back');
	}
}

middleware.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
		//then search the requested camp
		Comment.findById(req.params.comment_id, function(err, foundComment){
			// if there's error then go back
			if(err || !foundComment){
				req.flash('error', 'Comment not found');
				res.redirect('back');
			} 
			// if user is logged in then check if user owns the found post
			else{
				if(foundComment.author.id.equals(req.user._id)){
					// if camp's id and user's id match then render the page
					next();
				} else {
					req.flash('error', "You don't have permission to do that!");
					res.redirect('back');
				}
				
			};
		});
	} else {
		req.flash('error', 'You need to be logged in to do that!');
		res.redirect('back');
	}
}

middleware.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
		return next();
	}
	req.flash('error', 'You need to log in to do that!');
	res.redirect('/login');
}

module.exports = middleware;