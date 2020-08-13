const express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground");


router.get("/", (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
        if (err)
            console.log(err)
        else
            res.render("campgrounds", { campgrounds: allCampgrounds })
    });
})

router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new")
})

router.get("/:id", (req, res) => {
    let campId = req.params.id;
    console.log(campId)
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
//CREATE
router.post("/", isLoggedIn, (req, res) => {
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description
    var author = {
        id: req.user._id,
        username: req.user.username
    };

    let newCampground = { name: name, image: image, description: description, author: author };

    Campground.create(newCampground, (err, newlyCreated) => {
        if (err)
            console.log(err);
        else
            res.redirect("campgrounds/");
    })
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect("/login")
}

module.exports = router;