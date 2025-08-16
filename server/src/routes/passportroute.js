import express from 'express';
import passport from 'passport'
// import { isAuthenticated } from '../Controllers/passportController.js';


let router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' })  )
 
// router.get('/google/callback', passport.authenticate('google', { scope: ['profile'], failureRedirect:'/', successRedirect: process.env.FRONTEND_ORIGIN  }),
  

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: "/login", session: true }),
  (req, res) => {
    console.log(req.user);
    res.redirect(process.env.FRONTEND_ORIGIN);
  }
);
router.get('/auth/me', (req, res) => {
  if (req.isAuthenticated()) {
    console.log(req.user);
   return res.json(req.user); // Passport attaches user from DB
  } else {
    res.status(401).json({ message: 'Not logged in' });
  }
});
// router.get('/login', isAuthenticated, (req, res) => {
//   res.redirect('/profile');
// });

// router.get('/logout', (req, res) => {
//   req.logout((err)=>{
//     if(err) {
//       console.error('Logout error:', err);
//     }
//      res.redirect('/login');
//   });
 
router.post('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) {
      return next(err);
    }
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.clearCookie('connect.sid'); // This is the default cookie name for express-session
      res.status(200).json({ message: 'Logged out successfully' });
    });
  });
});

export { router };