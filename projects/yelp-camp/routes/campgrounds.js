const express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground");

const middleware = require("../middleware");


router.get("/", (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
        if (err)
            console.log(err)
        else
            res.render("campgrounds", { campgrounds: allCampgrounds })
    });
})

router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new")
})


router.get("/:id", (req, res) => {
    const campId = req.params.id;
    console.log("campId: " + campId)
    Campground.findById(campId).populate("comments").exec(function (err, foundCampground) {
        if (err || !foundCampground) {
            console.log(err);
            // req.flash('error', 'Sorry, that campground does not exist!');
            return res.redirect('/campgrounds');
        }
        //render show template with that campground
        return res.render("campgrounds/show", { campground: foundCampground });
    });
})
//CREATE
router.post("/", middleware.isLoggedIn, (req, res) => {
    let name = req.body.name;
    let price = req.body.price;
    let image = req.body.image;
    let description = req.body.description
    var author = {
        id: req.user._id,
        username: req.user.username
    };

    let newCampground = { name: name, image: image, description: description, author: author, price: price };

    Campground.create(newCampground, (err, newlyCreated) => {
        if (err)
            console.log(err);
        else
            res.redirect("campgrounds/");
    })
})

//EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, async (req, res) => {

    let campground = await Campground.findOne({ _id: req.params.id });
    res.render("campgrounds/edit", { campground: campground })

})
//UPDATE
router.put("/:id", middleware.isLoggedIn, (req, res) => {

    let updateData = req.body.campground;
    Campground.findByIdAndUpdate(req.params.id, updateData, (err, camp) => {
        if (err) {
            res.redirect("/campgrounds")
        } else {
            res.redirect("/campgrounds/" + req.params.id)
        }
    });

})

//DELETE
router.delete("/:id", middleware.checkCampgroundOwnership, async (req, res) => {

    try {
        let result = await Campground.findOneAndRemove(req.params.id, { useFindAndModify: false }).exec();
        console.log(result);
        res.redirect("/campgrounds")
    } catch (err) {
        console.log(err);
        res.redirect("/campgrounds")
    }
    // Campground.findByIdAndRemove(req.params.id, (err) => {
    //     if (err) {
    //         console.log(err)
    //         res.redirect("/campgrounds");
    //     }
    //     else
    //         res.redirect("/campgrounds")
    // });
})

module.exports = router;