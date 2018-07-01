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
    'time_placed': new Date(),
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

    var newValues = { $set: {'status': 'cancelled', 'time_cancelled': new Date() } };

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

    var newValues = { $set: {'status': 'fulfilled', 'time_fulfilled': new Date() } };

    dbo.collection("orders").updateOne({"_id": ObjectID(id)}, newValues, function(err, res) {
      if (err) throw err;
      console.log("1 order fulfilled");
      db.close();
    });
  });
}

function pushOrderWithDate(orderID, customerID, itemID, itemQTY, orderDate)
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
    'time_placed': new Date(),
    'time_fulfilled': '',
    'time_cancelled': '',
    'status': 'pending'};

  dbo.collection("orders").insertOne(order, function(err, res) {
    if (err) throw err;
    db.close();
    });
  });
}

function pushOrdersWithDate(checkout, orderDate)
{
  var promise = new Promise(function(resolve, reject){
    async.each(checkout, function(order, callback){
      getNextOrderID().then(function(next_id) {
        pushOrderWithDate(next_id, order.customerID, order.itemID, order.itemQTY, orderDate);
      });
    });
  });
  return promise;
}

function minutes(date)
{
  var hours = date.getHours();
  var minutes = date.getMinutes();
  return hours * 60 + minutes;
}

function createFakeData()
{
 var date = new Date('2018-01-01T14:00:00Z');
 var current = new Date();
 while(date < current)
 {
   var new_date = new Date(date.getTime() + 60000);
   var hour = new_date.getHours();
   if(hour > 5 && hour < 22)
   {
     var mins = minutes(new_date);
     var prob = -1 * .00000217 * Math.pow(mins - 840, 2) + .5;
     if (Math.random () < prob)
     {
       var checkout = [];

       var checkout_item = {};
       var customerID = Math.floor(Math.random() * 10000);
       checkout_item['customerID'] = customerID;
       checkout_item['itemID'] = Math.floor(Math.random() * 13) + 1;
       var qty = 0;
       var qtyprob = Math.floor(Math.random() * 10);
       if(qtyprob < 5) qty = 1;
       if(qtyprob >= 5 && qtyprob < 8) qty = 2;
       if(qtyprob >= 8) qty = 3;
       checkout_item['itemQTY'] = qty;

       checkout.push(checkout_item);

       var additional_rand = Math.floor(Math.random() * 10);

       if(additional_rand < 3)
       {
         var checkout_item = {};
         checkout_item['customerID'] = customerID;
         checkout_item['itemID'] = Math.floor(Math.random() * 13) + 1;
         var qty = 0;
         var qtyprob = Math.floor(Math.random() * 10);
         if(qtyprob < 5) qty = 1;
         if(qtyprob >= 5 && qtyprob < 8) qty = 2;
         if(qtyprob >= 8) qty = 3;
         checkout_item['itemQTY'] = qty;

         checkout.push(checkout_item);
       }
       pushOrdersWithDate(checkout);
     }
   }
   var date = new_date;
 }
}

// console.log(minutes(new Date()))
// minutes(new Date());
createFakeData();
