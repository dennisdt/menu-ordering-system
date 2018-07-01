var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var async = require('async');

var url = "mongodb://forrest:forrest123@ds123981.mlab.com:23981/overclocked";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = dbo.db("overclocked");

  var query = { address: "Park Lane 38" };

  dbo.collection("orders").find(query).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
  });
});
