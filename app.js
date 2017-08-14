var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override"); // needed for PUT and delete request

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/restful_blog_app", {useMongoClient: true});

//Mongoose model config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title:"Big Black Horse", 
//     image: "http://www.horsebreedsinfo.com/images/black_horse_running.jpg",
//     body: "I just love Big Black Horse. They are friendly and useful."
// }, function(err, blog){
//     if(err){
//         console.log(err);
//     }else{
//         console.log(blog);
//     }
// });

//RESTful Routes

//ROOT route
app.get("/", function(req, res){
    res.redirect("/blogs");
});

// INDEX ROUTE
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        }else{
            res.render("index", {blogs: blogs});
        }
    });
});

// NEW Route
app.get("/blogs/new", function(req, res) {
    res.render("new");
});

//CREATE Route
app.post("/blogs", function(req, res){
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    });
});

//Show Route
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show", {blog: foundBlog});
        }
    });
});

//Edit Route
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit", {blog: foundBlog});
        }
    });
});
//UPDATE Route
app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DELETE Route
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("App Started...");
});