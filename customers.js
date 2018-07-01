var MongoClient = require('mongodb').MongoClient;
var async = require('async');
var url = "mongodb://forrest:forrest123@ds123981.mlab.com:23981/overclocked";

function addCustomer(facebookID, name, fav1, fav2, points)
{
 // Connect to MongoDB

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("overclocked");

 // Add customer to collection Customers

    var customer = {
      'facebookID': facebookID,
      'name': name,
      'fav1': fav1,
      'fav2': fav2,
      'points': points
    };

    dbo.collection("customers").insertOne(customer, function(err, res) {
    if (err) throw err;
    db.close();
    });
  });
}

function addCustomers(checkout)
{
  var promise = new Promise(function(resolve, reject){
    async.each(checkout, function(customer, callback){
      addCustomer(customer.facebookID, customer.name, customer.fav1, customer.fav2, customer.points);
    });
  });
  return promise;
}

// var customers_sample = [{"facebookID":"asdfasdf123", "name":"David Ju", "fav1":"Bbq Drumsticks", "fav2":"Carrot Cake", "points":15},
// {"facebookID":"qwerqwer123", "name":"Sander Tang", "fav1":"Jackfruit Tacos", "fav2":"Ice Cream", "points":45}];

// addCustomers(customers_sample);
