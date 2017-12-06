const passport = require('passport');

module.exports = app => {
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );

  app.get(
    '/auth/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/homepage'
    }),
    (req, res) => {
      res.redirect('/calendar');
    }
  );

  app.get('/api/logout', (req, res) => {
    req.logout();
    req.session = null;
    res.redirect('/');
  });

  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
};
