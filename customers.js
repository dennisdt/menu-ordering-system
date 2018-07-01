var MongoClient = require('mongodb').MongoClient;
var async = require('async');
var url = "mongodb://forrest:forrest123@ds123981.mlab.com:23981/overclocked";

function addCustomer(facebookID)
{
 // Connect to MongoDB

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("overclocked");

 // Add customer to collection Customers

    var customer = {
      'customerID': facebookID,
      'name': '',
      'phone': '',
      'fav1': '',
      'address': '',
      'points': 0
    };

    dbo.collection("customers").insertOne(customer, function(err, res) {
    if (err) throw err;
    db.close();
    });
  });
}

function editName(customerID, name)
{
  var MongoClient = require('mongodb').MongoClient;

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("overclocked");

    var newValues = { $set: {'name': name } };

    dbo.collection("customers").updateOne({"customerID": customerID}, newValues, function(err, res) {
      if (err) throw err;
      console.log("customer name changed");
      db.close();
    });
  });
}

function editPoints(customerID, points)
{
  var MongoClient = require('mongodb').MongoClient;

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("overclocked");

    var newValues = { $set: {'points': points } };

    dbo.collection("customers").updateOne({"customerID": customerID}, newValues, function(err, res) {
      if (err) throw err;
      console.log("customer points changed");
      db.close();
    });
  });
}

function editFav1(customerID, itemID)
{
  var MongoClient = require('mongodb').MongoClient;

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("overclocked");

    var newValues = { $set: {'fav1': itemID } };

    dbo.collection("customers").updateOne({"customerID": customerID}, newValues, function(err, res) {
      if (err) throw err;
      console.log("customer fav1 changed");
      db.close();
    });
  });
}

function editFav2(customerID, itemID)
{
  var MongoClient = require('mongodb').MongoClient;

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("overclocked");

    var newValues = { $set: {'fav2': itemID } };

    dbo.collection("customers").updateOne({"customerID": customerID}, newValues, function(err, res) {
      if (err) throw err;
      console.log("customer fav2 changed");
      db.close();
    });
  });
}

function editPhone(customerID, phone)
{
  var MongoClient = require('mongodb').MongoClient;

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("overclocked");

    var newValues = { $set: {'phone': phone } };

    dbo.collection("customers").updateOne({"customerID": customerID}, newValues, function(err, res) {
      if (err) throw err;
      console.log("customer phone changed");
      db.close();
    });
  });
}

function updateFavs(customerID)
{
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("overclocked");
    var query = { customerID: customerID };
    dbo.collection("orders").find(query).toArray(function(err, orders) {
      if (err) throw err;

      var menu_item_counts = {};

      for (var i = 0 ; i < orders.length; i++)
      {
        var order = orders[i];

        if(order.itemID in menu_item_counts)
        {
          menu_item_counts[order.itemID] = menu_item_counts[order.itemID] + order.itemQTY;
        }
        else
        {
          menu_item_counts[order.itemID] = order.itemQTY;
        }
      }

      var sortable = [];
      for (var menu_item in menu_item_counts)
      {
        sortable.push([menu_item, menu_item_counts[menu_item]])
      }
      sortable.sort(function(a,b) {
        return b[1] - a[1];
      })

      if(sortable.length > 0)
      {
        editFav1(customerID, sortable[0][0]);
      }
      if(sortable.length > 1)
      {
        editFav2(customerID, sortable[1][0]);
      }

      db.close();
    });
  });
}

// updateFavs('1113');
// addCustomer('1113');
// editName('1113','Sander Tang');
// editPhone('1113','9095694801');
// editPoints('1113', 25);

// var customers_sample = [{"facebookID":"asdfasdf123", "name":"David Ju", "fav1":"Bbq Drumsticks", "fav2":"Carrot Cake", "points":15},
// {"facebookID":"qwerqwer123", "name":"Sander Tang", "fav1":"Jackfruit Tacos", "fav2":"Ice Cream", "points":45}];

// addCustomers(customers_sample);
