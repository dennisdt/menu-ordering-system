const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');
require('./models/User');
require('./services/passportConfig');  // since file is not exporting anything, don't assign to var
const authRoutes = require('./routes/authRoutes');


// Connect mongoose to mongo db
mongoose.connect(keys.mongoURI);

const app = express();

// configure cookies in milliseconds
// millseconds -> seconds -> minutes -> hours -> days * numDays
app.use(cookieSession({
  maxAge: 1000 * 60 * 60 * 24 * 30,
  keys: [keys.cookieKey]
  })
);

// tell passport to use cookies in
app.use(passport.initialize());
app.use(passport.session());


authRoutes(app);


const PORT = process.env.PORT || 5500;
app.listen(PORT);
