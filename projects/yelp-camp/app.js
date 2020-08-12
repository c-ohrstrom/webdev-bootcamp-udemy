const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    // User = require("./models/user"),
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

app.get("/campgrounds/:id/comments/new", (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err)
        } else {
            res.render("comments/new", { campground: campground })
        }
    });
})

app.post("/campgrounds/:id/comments", async (req, res) => {
    let campground = await Campground.findById(req.params.id).exec();

    const comment = await Comment.create(req.body.comment);

    campground.comments.push(comment);
    console.log("added: " + campground.comments)
    campground = await campground.save()
    res.redirect(`/campgrounds/${campground._id}`);
})

app.listen(3000, () => {
    console.log("working, on port 3000")
})