
// modules--------------------------------------------------------------------------->
const express = require("express");
const app = express();
const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({
  extended: true
}));
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const ejs = require("ejs");
const passport = require("passport");
const session = require("express-session");
const findOrCreate=require("mongoose-findorcreate");
const passportLocalMongoose = require("passport-local-mongoose");
app.set("view engine", "ejs");
app.use(express.static("public"));
const year = require(__dirname + "/src/date.js");
const imageModel = require(__dirname + "/src/components/image-model.js");
const URL = "mongodb+srv://jilani:1234@cluster0.nokxv.mongodb.net/portfolioDB";


const Storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/upload')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now()+path.extname(file.originalname);
    cb(null, file.fieldname + '_' + uniqueSuffix)
  }
});
const upload = multer({ storage: Storage });

// const GoogleStrategy = require('passport-google-oauth20').Strategy;

// const GitHubStrategy= require("passport-github2").Strategy;

app.use(session({
  secret: "random",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
// mongose connect
mongoose.connect(URL).then(() => {

}).catch((err) => {

});

// mongodb schema
const userSchema = new mongoose.Schema({

  // username:String,
  // email: String,
  // password: String,
facebookId:String,
githubId:String,
googleId:String,
  // comment: [{
  //   title: String,
  //   content: String,
  //   love: String,
  //   hate: String
  // }]
})


// plugin passport
userSchema.plugin(passportLocalMongoose);
// userSchema.plugin(findOrCreate);
// mongoose model
const UserData = mongoose.model("UserData", userSchema);

// passport strategy
passport.use(UserData.createStrategy());


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  UserData.findById(id,function(err,user){
done(err,user);
});
});

// // google strategy------------------------
// passport.use(new GoogleStrategy({
//     clientID: "787562156349-6j1g3tmcu9dv0i0hu3l1o8bi27chcbne.apps.googleusercontent.com",
//     clientSecret:"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" ,
//     callbackURL: "http://localhost:3000/auth/google/portfolio",
// userprofileURL:"https://www.googleapis.com/oath2/v3/userinfo",

//   },
//  function(accessToken, refreshToken, profile, cb) {

//       UserData.findOrCreate({ googleId: profile.id,username:profile.displayName ,email:profile.emails[0].value}, function (err, user) {
//         return cb(err, user);
//       });
//     }
// ));

// // github2 strategy--------------------------->
// passport.use(new GitHubStrategy({
//     clientID: "c68b55f86afd46426808",
//     clientSecret: "2d8cec0aaf29880dd3f3680d79af6dc7fffe970a",
//     callbackURL: "http://localhost:3000/auth/github/callback",
// scope: 'user:email'
//   },
//   function(accessToken, refreshToken, profile, cb) {
// console.log(profile);
//     UserData.findOrCreate({ githubId: profile.id,username:profile.username,email:profile.emails[0].value }, function (err, user) {
//       return cb(err, user);
//     });
//   }
// ));

// // github auoth--------------------------------------->
// app.get('/auth/github',
//   passport.authenticate('github'));

// app.get('/auth/github/callback',
//   passport.authenticate('github', { failureRedirect: '/login' }),
//   function(req, res) {
// res.send("successfully authenticated with github")
//   });
// // google auth------------
// app.get('/auth/google',
//   passport.authenticate('google', { scope: [
//         'https://www.googleapis.com/auth/userinfo.profile',
//         'https://www.googleapis.com/auth/userinfo.email'
//     ] }));

// app.get('/auth/google/portfolio',
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   function(req, res) {

//     res.send("successfully authenticate wuth google");

//   });

// signup route
app.get("/",(req,res)=>{
  imageModel.find((err,docs)=>{
  if (err) {
    throw err
  } else {

    res.render("partials/index",{day:year.getYear(),records:docs})
  }})
});



// app.route("/signuup").get(function(req, res) {
//   res.render("partials/signup", {
//     Day: year.getYear()
//   })
// }).post((req, res) => {
//   const {
//     username,
//     email,
//     password
//   } = req.body;

// UserData.findOne({email:email},(err,docs)=>{
// if (docs) {

//   console.log("duplicate email");
//   res.redirect("/signup")
// } else {
//   const users=new UserData({email: email, username :username});
//     UserData.register(users, password, (err,user) => {
//       if (err) {
     
//         res.redirect("/signup")
//       } else {
//         passport.authenticate("local")(req,res,() => {
//           res.send("successfully authenticated")
//         })
//       }
//     })
// }
// })

// })

// signin route
// app.route("/lo0gin").get(function(req, res) {

//     res.render("partials/login", {
//       Day: year.getYear()
//     })
//   }).post( function(req,res) {
// const {username,email,password}=req.body;

// const user=new UserData({
// username:username,
// email:email,
// password:password
// });
// req.login(user,function(err){
// if(err){console.log(err)}else{passport.authenticate("local", { failureRedirect: '/login', failureMessage: true })(req,res,function() {

//   res.send("successfully loggedin");
// })}
// });
// });


// -------------------ROUTES-------------------------------------------------------->
app.get("/thanks/:param",(req,res)=>{
switch (req.params.param) {
  case ("thanks"):

  res.send("Thank you!! I ( jilani ) have received your massage...i will get back to you soon!!❤😊")

    break;
    case ("failureMessage"):
    res.send("failed-loggin.Only for admins")

      break;
  default:
    res.send("failed")
}
});

app.post("/login", function(req,res) {
const {email,password}=req.body;

const user=new UserData({
email:email,
password:password
});

req.login(user,function(err){
if(err){}else{passport.authenticate("local", {failureRedirect: '/thanks/failureMessage', failureMessage:true })(req,res,function() {
res.redirect("/");
})}
});

});



 app.route("/Input").get((req,res)=>{
if(req.isAuthenticated()){

res.render("partials/input")

}else{
res.send("you are not permitted to enter..only for admins")
}
}).post(upload.single("file"), function (req, res, next) {
const {title,content}=req.body;
const imageName=req.file.filename;

  imageModel.findOneAndUpdate({title:title},{$push:{imageName}},(err,result)=>{
if (!result) {
  const imageData=new imageModel({
  title:title,
  content:content,
  imageName:[imageName]
  });
  imageData.save((err,doc)=>{
    if (err) {
      throw err
    }else{}
  });

    res.redirect("/");
} else {

res.send("successfully updated file.")
}
})


})
    app.listen(process.env.PORT || 3000, function() {

          })
        
