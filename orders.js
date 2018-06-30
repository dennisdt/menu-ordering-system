var MongoClient = require('mongodb').MongoClient;
var async = require('async');
var url = "mongodb://forrest:forrest123@ds123981.mlab.com:23981/overclocked";

// var orders_sample = [{"orderID":1,"customerID":1,"itemID":1,"itemQty":1,"time_placed":"1/1/2018 9:45","time_fulfilled":"1/1/2018 9:55","time_revised":""},{"orderID":2,"customerID":2,"itemID":2,"itemQty":1,"time_placed":"1/1/2018 9:45","time_fulfilled":"1/1/2018 9:55","time_revised":""}];

function pushOrder(orderID, customerID, itemID, itemQTY, time_placed)
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
    'time_placed': time_placed,
    'time_fulfilled': '',
    'time_cancelled': '',
    'status': 'pending'};

  dbo.collection("orders").insertOne(order, function(err, res) {
    if (err) throw err;
    db.close();
    });
  });
}

function pushOrders(checkout)
{
  var promise = new Promise(function(resolve, reject){
    async.each(checkout, function(order, callback){
      getNextOrderID().then(function(next_id) {
        pushOrder(next_id, order.customerID, order.itemID, order.itemQTY, order.time_placed);
      });
    });
  });
  return promise;
}

// var checkout_sample = [{"customerID":3,"itemID":1,"itemQTY":1,"time_placed":"1/1/2018 9:45"},
// {"customerID":3,"itemID":2,"itemQTY":1,"time_placed":"1/1/2018 9:45"}];
// pushOrders(checkout_sample);

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

function cancelOrder(orderID)
{

}
