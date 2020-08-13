const express = require("express"),
    router = express.Router({ mergeParams: true }),
    Campground = require("../models/campground"),
    Comment = require("../models/comment");


//comments/new
router.get("/new", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err)
        } else {
            res.render("comments/new", { campground: campground })
        }
    });
})
//comments/create
router.post("/", isLoggedIn, async (req, res) => {
    let campground = await Campground.findById(req.params.id).exec();

    const newComment = await Comment.create(req.body.comment);
    newComment.author.id = req.user._id;
    newComment.author.username = req.user.username;
    newComment.save()
    campground.comments.push(newComment);
    console.log(newComment)
    campground = await campground.save()
    res.redirect(`/campgrounds/${campground._id}`);
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect("/login")
}

module.exports = router;