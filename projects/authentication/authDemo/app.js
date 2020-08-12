const express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User = require("./models/user")

mongoose.connect("mongodb://localhost:27017/auth_demo_app", {
    useUnifiedTopology: true,
    useNewUrlParser: true
}, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log("connected to DB")
    }
})

app.set("view engine", "ejs");
app.use(require("express-session")({
    secret: "Hejsan hoppsan",
    resave: false,
    saveUninitialized: false
}));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// ################ ROUTES ########################

app.get("/", (req, res) => {
    res.render("home")
})

app.get("/secret", isLoggedIn, (req, res) => {
    res.render("secret")
})

//#region Auth routes
app.get("/register", (req, res) => {
    res.render("register")
})

app.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    User.register(new User({ username: username }), password, (err, user) => {
        if (err) {
            console.log(err)
            return res.render("register")
        } else {
            passport.authenticate("local")(req, res, () => {
                res.redirect("/secret")
            })
        }
    })
})
//#endregion

//#region Login
app.get("/login", (req, res) => {
    res.render("login")
})
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), (req, res) => {
    const username = req.body.username;
    const password = req.body.password
})

app.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/")
})
//#endregion

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next;
    }
    res.redirect("/login")
}

app.listen(3000, () => {
    console.log("server started on 3000")
})