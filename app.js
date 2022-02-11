//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

let homeStartingContent = "Welcome to La La Land"
let aboutContent = "have fun and type anything you want. You will remain anonymous. Also can edit home, about and contact page";
let contactContent = "0068971235687125497412564913345846ABCDEF"

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-troll:test_567@cluster0.li9iq.mongodb.net/blogDB",{ useNewUrlParser:true });

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post",postSchema);

// const posts = [];

app.get("/", function(req, res){
  Post.find({},function(err, posts){
    res.render('home',{
      startingContent: homeStartingContent,
      posts: posts});
  });
});


app.get("/compose", function(req, res){
  res.render('compose');
});

app.post("/compose", function(req, res){
  if (req.body.postTitle == "Home"){
    homeStartingContent = req.body.postBody;
    res.redirect("/");
  }else if(req.body.postTitle == "About") {
    aboutContent = req.body.postBody;
    res.redirect("/");
  }else if(req.body.postTitle == "Contact"){
    contactContent = req.body.postBody;
    res.redirect("/");
  }else{
    // const post = {
      //   title: req.body.postTitle,
      //   content: req.body.postBody
      // };
      // posts.push(post);
      const post = new Post({
        title: req.body.postTitle,
        content: req.body.postBody
      });
      
      post.save(function (err) {
        if (!err) {
          res.redirect("/");
        }
      });
    }
  });
  
  app.get("/posts/:postId", function(req, res){
    const requestedPostId = req.params.postId;
    
    Post.findOne({_id: requestedPostId},function (err,post) {
    res.render('post',{
      title: post.title,
      content: post.content
    });
  });
});
  
  // posts.forEach(function(post){
  //   const storedTitle = _.lowerCase(post.title);

  //   if (storedTitle == requestedTitle){
  //     res.render('post',{
  //       title: post.title,
  //       content: post.content
  //     });
  //   }
  // });

app.get("/about", function(req, res){
  res.render('about',{aboutContent: aboutContent});
});
  
app.get("/contact", function(req, res){
  res.render('contact',{contactContent: contactContent});
});

let port = process.env.PORT;
if(port == null || port == ""){
  port = 3000;
}

app.listen(port, function() {
  console.log("Server is running on " + port);
});
