const express = require("express");
const app = express();
const bodyParser = require("body-parser")

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/yelpCamp",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Connected to DB!"))
    .catch(error => console.log(error.message))

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
    res.render("campgrounds", { campgrounds: campgrounds })
})

app.post("/campgrounds", (req, res) => {
    let name = req.body.name;
    let image = req.body.image;
    let newCampground = { name: name, image: image }
    campgrounds.push(newCampground)

    res.redirect("campgrounds")
})

app.get("/campgrounds/new", (req, res) => {
    res.render("new")
})

app.listen(3000, () => {
    console.log("working, on port 3000")
})