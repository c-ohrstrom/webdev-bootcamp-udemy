const express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user");


//root route
router.get("/", (req, res) => {
    res.render("landing")
})
//sign up/GET
router.get("/register", (req, res) => {
    res.render("register")
});
//sign up/POST
router.post("/register", (req, res) => {
    const newUser = new User({ username: req.body.username })
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err)
            req.flash("error", err.message)
            return res.render("/register")
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome to YelpCamp " + user.username)
            res.redirect("/campgrounds")
        })
    })
});
// login/GET
router.get("/login", (req, res) => {
    res.render("login")
})
// login/POST
router.post("/login", passport.authenticate("local",
    { successRedirect: "/campgrounds", failureRedirect: "/login" }),
    (req, res) => {
        res.send("login happen here")
    });

router.get("/logout", (req, res) => {
    req.flash("success", "You logged out")
    req.logout();
    res.redirect("/campgrounds")
});

module.exports = router;