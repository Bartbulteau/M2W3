module.exports = function (io) {
  var express = require('express');
  var router = express.Router();
  var mongoose = require('mongoose');
  var path = require('path');
  var bodyParser = require('body-parser');
  // bring in model
  var User = require('../models/user');

  var session = require('client-sessions');

  router.use(bodyParser.json());
  router.use(bodyParser.urlencoded({ extended: true }));
  router.use(session({
    cookieName: 'session',
    secret: 'random_string_goes_here',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
  }));

  router.use(function (req, res, next) {
    if (req.session && req.session.user) {
      User.findOne({ email: req.session.user.email }, function (err, user) {
        if (user) {
          req.user = user;
          delete req.user.password; // delete the password from the session
          req.session.user = user;  //refresh the session value
          res.locals.user = user;
        }
        // finishing processing the middleware and run the route
        next();
      });
    } else {
      next();
    }
  });

  function requireLogin(req, res, next) {
    if (!req.user) {
      res.redirect('/login');
    } else {
      next();
    }
  };

  function isLoggedIn(req, res) {
    if (!req.user) {
      return false;
    } else {
      return true;
    }
  };

  router.get('/login', function (req, res) {
    var loggedin = isLoggedIn(req, res);
    if (loggedin) {
      res.redirect('/');
    }
    else {
      res.render('login');
    }
  });

  router.post('/login', function (req, res) {
    console.log(req.body);
    User.findOne({ email: req.body.email }, function (err, user) {
      if (!user) {
        res.render('login', { error: 'Email ou mot de passe invalide.' });
      } else {
        if (user !== null) {
          user.comparePassword(req.body.password, function (err, isMatch) {
            if (err) res.render('login', { error: 'Email ou mot de passe invalide.' });
            if (isMatch === true) {
              // console.log(password + " : ", isMatch);
              // console.log('dataValues : ', user);
              req.session.user = user;
              res.redirect('/');
            } else {
              res.render('login', { error: 'Email ou mot de passe invalide.' });
            }
          });
        } else {
          res.render('login', { error: 'Email ou mot de passe invalide.' });
        }
      }
    });
  });

  router.get('/signup', (req, res) => {
    var loggedin = isLoggedIn(req, res);
    if (loggedin) {
      res.redirect('/');
    }
    else {
      res.render('signup');
    }
  })

  router.post('/signup', (req, res) => {
    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.email = req.body.email;
    if (user.name === "" || user.email === "" || user.password === "") {
      res.render('signup', { error: 'Complétez bien tous les champs'  });
    }
    else {
      user.save(err => {
        console.log(err)
        if (err) {
          // console.log('there is an error');
          res.render('signup', { error: 'Email ou nom d\'utilisateur déjà utilisé par quelqu\'un'  });
        } else {
          req.session.user = user;
          res.redirect('/');
        }
      }); 
    }
  });

  router.get('/', requireLogin, function (req, res) {
    io.on('connection', function(socket) {
      socket.emit('username', req.session.user.username);
    });
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });

  router.get('/logout', function (req, res) {
    req.session.reset();
    res.redirect('/login');
  });

  return router;
}
