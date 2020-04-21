var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", function(req, res){
	res.render("landing");
});

//===================
//   AUTH Routes
//===================

//register route
router.get("/register", function(req, res){
	res.render("register");
})

router.post("/register", function(req, res){
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
		if(err){
			return res.render("register", {"error": err.message});
		} else {
			passport.authenticate("local")(req, res, function(){
				req.flash("success", "Welcome to YelpCamp " + user.username);
				res.redirect("campgrounds");
			});
		}
	});
});

//login route
router.get("/login", function(req, res){
	res.render("login");
});

router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), function(req, res){
});

//logout route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged Out Successfully!");
	res.redirect("campgrounds");
});

module.exports = router;