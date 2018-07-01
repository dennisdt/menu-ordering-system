const passport = require('passport');


// Route handlers *************************

module.exports = (app) => {

  app.get('/api/user_info',
      (req,res) => { res.send(req.user); }
  );

  app.get('/api/logout', (req,res) => {
        req.logout();
        res.redirect('/');
      });



// FACEBOOK ***********************************
  // authenticate user for first time with Facebook, request code
  app.get('/auth/facebook',
    passport.authenticate('facebook', {
        scope: 'email'
      }
    )
  );

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    (req, res) => {
      // Successful authentication, redirect home.
      res.redirect('/home');
    });


// TWITTER ***********************************
  

};
