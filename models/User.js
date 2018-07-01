const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User is a Model Class, with String instance variable googleID

// User class constructor
// This schema contains all the data we care about in our user
  // Schema attribute: data type
const userSchema = new Schema({
  googleID: String,
  facebookID: String,
  twitterID: String
});

// model(name_of_collection, schema_we_created)
mongoose.model('users', userSchema);
