var express = require('express'),
	router = express.Router({mergeParams : true}),
	Campground 	= require('../models/campground'),
	Comment 	= require('../models/comment'),
	middleware 	= require('../middleware');

// COMMENTS ROUTES

// NEW ROUTE
router.get('/new', middleware.isLoggedIn , function(req, res){
	Campground.findById(req.params.id, function(err, foundCamp){
		if (err || !foundCamp){
			req.flash('error', 'Campground not found!')
			res.redirect('back');
		} else{
			res.render('comments/new', {campground : foundCamp});
		}
	});
});

// CREATE ROUTE
router.post('/', middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, foundCamp){
		if(err){
			console.log(err);
		} else{
			
			Comment.create(req.body.comment, function(err, newComment){
				if (err){
					req.flash('error', 'Something went wrong!');
					console.log(err);
				}
				else{
					newComment.author.id = req.user._id;
					newComment.author.username = req.user.username;
					newComment.save();
					foundCamp.comments.push(newComment);
					foundCamp.save();
					req.flash('success', 'Comment added. Thank you!');
					res.redirect('/campgrounds/'+ foundCamp._id);
				}
				
			})
		}
	});
});

// EDIT COMMENT ROUTE
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCamp){
		if(err || !foundCamp){
			req.flash('error', 'Campground not found!');
			return res.redirect('back');
		}
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if (err){
				res.redirect('back');
			} else {
				res.render('comments/edit', {campground_id : req.params.id, comment : foundComment});
			}
		})
	})
	
})

// UPDATE ROUTE
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect('back');
		} else {
			res.redirect('/campgrounds/' + req.params.id);
		}
	})
})

// DELETE ROUTE
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect('back');
		} else {
			req.flash('success', 'Comment deleted');
			res.redirect('/campgrounds/' + req.params.id);
		}
	})
})

module.exports = router;