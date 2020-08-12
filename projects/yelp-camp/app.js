const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds")

mongoose.connect("mongodb://localhost:27017/yelp_camp",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Connected to DB!"))
    .catch(error => console.log(error.message))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(__dirname + "/public"))
app.set("view engine", "ejs")

// seedDB();

app.use(require("express-session")({
    secret: "Yelp is camp",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})

app.get("/", (req, res) => {
    res.render("landing")
})

app.get("/campgrounds", (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
        if (err)
            console.log(err)
        else
            res.render("campgrounds/index", { campgrounds: allCampgrounds })
    });
})

app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new")
})

app.get("/campgrounds/:id", (req, res) => {
    let campId = req.params.id;
    console.log(req.params)
    Campground.findById(campId).populate("comments").exec((err, foundCamp) => {
        if (err)
            console.log(err)
        else {
            console.log(foundCamp)
            res.render("campgrounds/show", { campground: foundCamp });
        }
    })
})

app.post("/campgrounds", (req, res) => {
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description
    let newCampground = { name: name, image: image, description: description };

    Campground.create(newCampground, (err, newlyCreated) => {
        if (err)
            console.log(err)
        else
            res.redirect("campgrounds/index")
    })
})

app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err)
        } else {
            res.render("comments/new", { campground: campground })
        }
    });
})

app.post("/campgrounds/:id/comments", isLoggedIn, async (req, res) => {
    let campground = await Campground.findById(req.params.id).exec();

    const comment = await Comment.create(req.body.comment);

    campground.comments.push(comment);
    console.log("added: " + campground.comments)
    campground = await campground.save()
    res.redirect(`/campgrounds/${campground._id}`);
});

app.get("/register", (req, res) => {
    res.render("register")
});

app.post("/register", (req, res) => {
    const newUser = new User({ username: req.body.username })
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err)
            return res.render("/register")
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect("/campgrounds")
        })
    })
});

app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/login", passport.authenticate("local",
    { successRedirect: "/campgrounds", failureRedirect: "/login" }),
    (req, res) => {
        res.send("login happen here")
    });

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/campgrounds")
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect("/login")
}

app.listen(3000, () => {
    console.log("working, on port 3000")
})