const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/cat_app",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Connected to DB!"))
    .catch(error => console.log(error.message))

let catSchema = mongoose.Schema({
    name: String,
    age: Number,
    temperament: String
})

let Cat = mongoose.model("Cat", catSchema)

// const newCat = new Cat({
//     name: "Mrs Norris",
//     age: 7,
//     temperament: "Evil"
// });

// newCat.save((err, cat) => {
//     if (err)
//         console.log("something went wrong")
//     else
//         console.log(cat);
// });
Cat.create({
    name: "Snow White",
    age: 15,
    temperament: "Bland"
}, (err, obj) => {
    if (err)
        console.log(err)
    else {
        console.log("created")
        console.log(obj)
    }
})

Cat.find({}, (err, cats) => {
    if (err)
        console.log(err)
    else {
        console.log("All kitties")
        console.log(cats)
    }
})