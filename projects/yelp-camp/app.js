const express = require("express");
const app = express();
app.set("view engine", "ejs")

app.get("/", (req, res) => {
    res.render("landing")
})

app.get("/campgrounds", (req, res) => {
    let campgrounds = [
        { name: "Salmon Creek", image: "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=350" },
        { name: "Creepy Woods", image: "https://images.pexels.com/photos/1840421/pexels-photo-1840421.jpeg?auto=compress&cs=tinysrgb&h=350" },
        { name: "Hairy Bear Salon", image: "https://pixabay.com/get/52e8d4444255ae14f1dc84609620367d1c3ed9e04e507440712979d6964ec6_340.jpg" },
    ]
    res.render("campgrounds", { campgrounds: campgrounds })
})

app.listen(3000, () => {
    console.log("working!")
})