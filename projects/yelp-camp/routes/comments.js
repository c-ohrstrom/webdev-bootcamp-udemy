const express = require("express"),
    router = express.Router({ mergeParams: true }),
    Campground = require("../models/campground"),
    Comment = require("../models/comment");

const middleware = require("../middleware");


//comments/new
router.get("/new", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err)
        } else {
            res.render("comments/new", { campground: campground })
        }
    });
})
//comments/create
router.post("/", middleware.isLoggedIn, async (req, res) => {
    let campground = await Campground.findById(req.params.id).exec();

    const newComment = await Comment.create(req.body.comment);
    newComment.author.id = req.user._id;
    newComment.author.username = req.user.username;
    newComment.save()
    campground.comments.push(newComment);
    console.log(newComment)
    campground = await campground.save()
    req.flash("success", "Successfully added comment")
    res.redirect(`/campgrounds/${campground._id}`);
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, async (req, res) => {
    try {
        const foundComment = await Comment.findById(req.params.comment_id).exec()
        res.render("comments/edit", { campground_id: req.params.id, comment: foundComment });

    } catch (err) {
        console.log(err)
        res.redirect("back")
    }
});

//UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, async (req, res) => {
    try {
        const foundComment = await Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment).exec()
        res.redirect("/campgrounds/" + req.params.id)
    } catch (err) {
        console.log(err)
        res.redirect("back")
    }

});

//DELETE
router.delete("/:comment_id", middleware.checkCommentOwnership, async (req, res) => {
    try {
        let result = await Comment.findByIdAndDelete(req.params.comment_id, { useFindAndModify: true }).exec();
        console.log(result);
        req.flash("success", "Comment deleted")
        res.redirect("/campgrounds/" + req.params.id)
    } catch (err) {
        console.log(err);
        res.redirect("back")
    }
})

module.exports = router;