const express = require("express"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    app = express();

// APP Config
mongoose.connect("mongodb://localhost:27017/blog_app", { useNewUrlParser: true, useUnifiedTopology: true });
app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(expressSanitizer());
app.use(methodOverride("_method"));

const blogSchema = mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
})
const Blog = mongoose.model("Blog", blogSchema);

// RESTFUL ROUTES
app.get("/blogs", (req, res) => {
    Blog.find({}, (err, blogs) => {
        if (err)
            console.log(err)
        else
            res.render("index", { blogs: blogs })
    })
})

app.post("/blogs", (req, res) => {
    const blogPost = req.body.blog;
    blogPost.body = req.sanitize(blogPost.body)
    Blog.create(blogPost, (err, newBlog) => {
        if (err)
            res.render("new")
        else
            res.redirect("blogs")
    })
})

app.get("/blogs/new", (req, res) => {
    Blog.find({}, (err, blogs) => {
        if (err)
            console.log(err)
        else
            res.render("new", { blogs: blogs })
    })
})

app.get("/blogs/:id", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err)
            res.redirect("/blogs")
        else
            res.render("show", { blog: foundBlog })
    })

})

app.get("/blogs/:id/edit", (req, res) => {
    const blogId = req.params.id;
    Blog.findById(blogId, (err, foundBlog) => {
        if (err)
            res.redirect("/blogs")
        else
            res.render("edit", { blog: foundBlog })
    })
})

app.put("/blogs/:id", (req, res) => {
    const blogPost = req.body.blog;
    blogPost.body = req.sanitize(blogPost.body)

    Blog.findByIdAndUpdate(req.params.id, blogPost.blog, (err, updatedBlog) => {
        if (err)
            res.redirect("blogs")
        else
            res.redirect("/blogs/" + updatedBlog._id)
    })
})

app.delete("/blogs/:id", (req, res) => {
    Blog.findByIdAndDelete(req.params.id, (err) => {
        if (err)
            res.redirect("blogs");
        else
            res.redirect("blogs");
    })
})

app.get("/", (req, res) => {
    res.redirect("blogs")
})

app.listen("3000", () => {
    console.log("server is running on 3000")
})