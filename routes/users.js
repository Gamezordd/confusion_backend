var express = require('express');
var router = express.Router();
var User = require('../models/user');
const bodyParser= require('body-parser');
var passport = require('passport');
var authenticate = require("../authenticate")
var Users = require('../models/user')

var router = express.Router();
router.use(bodyParser.json());

router.get('/',authenticate.verifyUser, function(req, res, next) {
  console.log("req in get users", req.user);
  authenticate.verifyAdmin(req,next);
  Users.find()
  .then((users) =>{
    res.statusCode=200;
    res.setHeader('Content-Type', 'application/json');
    res.json(users);
  }, (err) => next(err))
  .catch((err) => next(err));
});

router.post('/signup', function(req, res, next){
  User.register(new User({username: req.body.username}),
      req.body.password, (err,user) =>{
      if (err){
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err: err});
      }
      else{
        console.log("Signup req: ", req.body);
        if (req.body.firstname)
          user.firstname = req.body.firstname;
        if (req.body.lastname)
          user.lastname = req.body.lastname;
        user.save((err, user) => {
          if(err){
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
            return;
          }
        })
        passport.authenticate('local')(req,res, () =>{
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful'})
        });
      }
  });
});

router.post('/login', passport.authenticate('local'), (req, res, next) =>{
  var token = authenticate.getToken({_id: req.user._id})
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'Login Successful'})

});
router.get('/logout', (req, res) => {
  if (req.session){
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else{
    var err = new Error('You are not logged in');
    err.status = 403;
    next(err);
    return;
  }
})

module.exports = router;
