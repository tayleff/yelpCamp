var express = 		require("express"),
	app = 			express(),
	bodyParser = 	require("body-parser"),
	mongoose = 		require("mongoose"),
	flash = 		require("connect-flash"),
	passport = 		require("passport"),
	methodOverride = require("method-override"),
	LocalStrategy = require("passport-local"),
	Campground = 	require("./models/campground"),
	Comment = 		require("./models/comment"),
	User = 			require("./models/user"),
	seedDB = 		require("./seeds");

//require routes
var commentRoutes = 	require("./routes/comments"),
	campgroundRoutes = 	require("./routes/campgrounds"),
	indexRoutes = 		require("./routes/index");

mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/yelp_camp");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//passport configuration
app.use(require("express-session")({
	secret: "Sophie is the cutest doggo",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
})

app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

	// var campgrounds = [
	// 	{name: "Sam Creek", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTfrH1647OQVMTq23zZoLCAYu0ZxHwwAg9lYspeU93aNK7tsdEN&usqp=CAU"},
	// 	{name: "Granite Hill", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQCMy3Lfjabmvqs5vQEEaiMm_27gAxPLJdgksUtjtcxWtjcxGVW&usqp=CAU"},
	// 	{name: "Mountain Goat's Rest", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSqkQJo9G8Qb3rexI6oguYMWvwj5wYIWgLLeVbb22-nEVBF2Xee&usqp=CAU"}
	// ];

//=================
//seed the database
//=================
//seedDB();

app.listen(3000, function(){
	console.log("YelpCamp Server Started");
});