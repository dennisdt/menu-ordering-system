var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var async = require('async');

var url = "mongodb://forrest:forrest123@ds123981.mlab.com:23981/overclocked";

// push one order to mongo DB
function pushOrder(orderID, customerID, itemID, itemQTY)
{
  // Connect to MongoDB

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("overclocked");

  // Add single order to collection Orders

  var order = {
    'orderID': orderID,
    'customerID': customerID,
    'itemID': itemID,
    'itemQTY': itemQTY,
    'time_placed': getDate(),
    'time_fulfilled': '',
    'time_cancelled': '',
    'status': 'pending'};

  dbo.collection("orders").insertOne(order, function(err, res) {
    if (err) throw err;
    db.close();
    });
  });
}

// push checkout orders
function pushOrders(checkout)
{
  var promise = new Promise(function(resolve, reject){
    async.each(checkout, function(order, callback){
      getNextOrderID().then(function(next_id) {
        pushOrder(next_id, order.customerID, order.itemID, order.itemQTY);
      });
    });
  });
  return promise;
}

// get next order ID
function getNextOrderID()
{
  var promise = new Promise(function(resolve, reject) {
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("overclocked");

      dbo.collection("orders").find({}).toArray(function(err, orders) {
        if (err) throw err;
        var max = 1;
        for (var i = 0; i < orders.length; i++)
        {
          var order = orders[i];
          var current = order.orderID;
          if (current > max) max = current;
        }
        resolve(max + 1);
        db.close();
      });
    });
  });
  return promise;
}

// set order #id status to 'cancelled'
function cancelOrder(id)
{
  var MongoClient = require('mongodb').MongoClient;

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("overclocked");

    var newValues = { $set: {'status': 'cancelled', 'time_cancelled': getDate() } };

    dbo.collection("orders").updateOne({"_id": ObjectID(id)}, newValues, function(err, res) {
      if (err) throw err;
    console.log("1 order cancelled");
      db.close();
    });
  });
}

// set order #id status to 'fulfilled'
function fulfillOrder(id)
{
  var MongoClient = require('mongodb').MongoClient;

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("overclocked");

    var newValues = { $set: {'status': 'fulfilled', 'time_fulfilled': getDate() } };

    dbo.collection("orders").updateOne({"_id": ObjectID(id)}, newValues, function(err, res) {
      if (err) throw err;
      console.log("1 order fulfilled");
      db.close();
    });
  });
}

//get current date in format e.g. Jun 30 2018 18:32:00
function getDate()
{
  var date = new Date();
  var datestring = date.toString();
  var datearray = datestring.split(" ");
  var parsed = datearray[1] + " " + datearray[2] + " " + datearray[3] + " " + datearray[4];
  return parsed;
}
