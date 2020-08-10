const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/yelp_camp",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Connected to DB!"))
    .catch(error => console.log(error.message))

const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
})

let Campground = mongoose.model("Campground", campgroundSchema)

// CampGround.create(
//     {
//         name: "Creepy Woods", image: "https://images.pexels.com/photos/1840421/pexels-photo-1840421.jpeg?auto=compress&cs=tinysrgb&h=350",
//         description: "This is a camp in a creepy wood. Very scary!"
//     },
//     (err, camp) => {
//         if (err)
//             console.log(err)
//         else {
//             console.log("new created campground: ")
//             console.log(camp)
//         }
//     })

app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine", "ejs")

let campgrounds = [
    { name: "Salmon Creek", image: "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=350" },
    { name: "Creepy Woods", image: "https://images.pexels.com/photos/1840421/pexels-photo-1840421.jpeg?auto=compress&cs=tinysrgb&h=350" },
    { name: "Hairy Bear Salon", image: "https://pixabay.com/get/52e8d4444255ae14f1dc84609620367d1c3ed9e04e507440712979d6964ec6_340.jpg" },
]

app.get("/", (req, res) => {
    res.render("landing")
})

app.get("/campgrounds", (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
        if (err)
            console.log(err)
        else
            res.render("campgrounds", { campgrounds: allCampgrounds })
    });
})

app.get("/campgrounds/new", (req, res) => {
    res.render("new")
})

app.get("/campgrounds/:id", (req, res) => {
    let campId = req.params.id;
    console.log(req.params)
    Campground.findById(campId, (err, camp) => {
        if (err)
            console.log(err)
        else
            res.render("show", { campground: camp });
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
            res.redirect("campgrounds")
    })
})


app.listen(3000, () => {
    console.log("working, on port 3000")
})