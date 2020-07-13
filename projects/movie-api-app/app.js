const express = require("express");
const app = express();
const axios = require("axios");

app.set("view engine", "ejs")

app.get("/results", async (req, res) => {
    const search = req.query.search;
    const response = await axios.get(`http://www.omdbapi.com/?apikey=thewdb&s=${search}`);
    if (response.status === 200) {

        const data = response.data;
        console.log(data)
        res.render("results", { data: data })
    }
});

app.get("/", (req, res) => {
    res.render("search")
})

app.listen(3000, () => {
    console.log("movie app started")
}); 