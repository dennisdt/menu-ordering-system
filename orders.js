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
    console.log('1 order pushed');
    db.close();
    });
  });
}

function pushOrdersArray(orders)
{
  // Connect to MongoDB

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("overclocked");

  // Add single order to collection Orders

  dbo.collection("orders").insertMany(orders, function(err, res) {
    if (err) throw err;
    db.close();
    });
  });
}

// push checkout orders
function pushOrders(checkout)
{
  var promise = new Promise(function(resolve, reject){
    getNextOrderID().then(function(next_id) {
      async.each(checkout, function(order, callback){
        pushOrder(next_id, order.customerID, order.itemID, order.itemQTY);
      });
    });
  });
  return promise;
}

function pendingOrders()
{
  var promise = new Promise(function(resolve, reject) {
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("overclocked");
      var current_date = new Date();
      var start_date = new Date(current_date.getTime() - 24*60*60000);
      var query = { status: 'pending', time_placed: {
        $gte: start_date } };

      dbo.collection("orders").find(query).toArray(function(err, orders) {
        if (err) throw err;

        var same_day_orders = [];
        for (var i = 0; i < orders.length; i++)
        {
          var order = orders[i];
          var order_date = order.time_placed;
          if(order_date.getDate() === current_date.getDate())
          {
            same_day_orders.push(order);
          }
        }
        console.log(same_day_orders)
        resolve(orders);
        db.close();
      });
    });
  });
  return promise;
}

function fulfilledOrders()
{
  var promise = new Promise(function(resolve, reject) {
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("overclocked");
      var current_date = new Date();
      var start_date = new Date(current_date.getTime() - 24*60*60000);
      var query = { status: 'fulfilled', time_placed: {
        $gte: start_date } };

      dbo.collection("orders").find(query).toArray(function(err, orders) {
        if (err) throw err;

        var same_day_orders = [];
        for (var i = 0; i < orders.length; i++)
        {
          var order = orders[i];
          var order_date = order.time_placed;
          if(order_date.getDate() === current_date.getDate())
          {
            same_day_orders.push(order);
          }
        }
        console.log(same_day_orders)
        resolve(orders);
        db.close();
      });
    });
  });
  return promise;
}

function cancelledOrders()
{
  var promise = new Promise(function(resolve, reject) {
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("overclocked");
      var current_date = new Date();
      var start_date = new Date(current_date.getTime() - 24*60*60000);
      var query = { status: 'cancelled', time_placed: {
        $gte: start_date } };

      dbo.collection("orders").find(query).toArray(function(err, orders) {
        if (err) throw err;

        var same_day_orders = [];
        for (var i = 0; i < orders.length; i++)
        {
          var order = orders[i];
          var order_date = order.time_placed;
          if(order_date.getDate() === current_date.getDate())
          {
            same_day_orders.push(order);
          }
        }
        console.log(same_day_orders)
        resolve(orders);
        db.close();
      });
    });
  });
  return promise;
}

function allOrders()
{
  var promise = new Promise(function(resolve, reject) {
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("overclocked");
      var current_date = new Date();
      var start_date = new Date(current_date.getTime() - 24*60*60000);
      var query = { time_placed: {
        $gte: start_date } };

      dbo.collection("orders").find(query).toArray(function(err, orders) {
        if (err) throw err;

        var same_day_orders = [];
        for (var i = 0; i < orders.length; i++)
        {
          var order = orders[i];
          var order_date = order.time_placed;
          if(order_date.getDate() === current_date.getDate())
          {
            same_day_orders.push(order);
          }
        }
        console.log(same_day_orders)
        resolve(orders);
        db.close();
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
      dbo.collection("orders").count().then(function (data) {
        resolve(data + 1);
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

function minutes(date)
{
  var hours = date.getHours();
  var minutes = date.getMinutes();
  return hours * 60 + minutes;
}

function createFakeData()
{
 var date = new Date('2018-01-01T14:00:00Z');
 var orderID = 1;
 var current = new Date();
 var orders = [];
 while(date < current)
 {
   var new_date = new Date(date.getTime() + 60000);
   var fulfilled_date = new Date(date.getTime() + 12*60000);
   var hour = new_date.getHours();
   if(hour > 5 && hour < 22)
   {
     var mins = minutes(new_date);

     var prob = -1 * .00000217 * Math.pow(mins - 840, 2) + .5;
     if (new_date.getDay() in [5, 6]) prob *= 1.3;
     else if (new_date.getDay() in [0, 4]) prob *= 1.15;
     else prob *= 0.75;

     if (Math.random () < prob)
     {
       var order = {};
       order['orderID'] = orderID;
       var customerID = Math.floor(Math.random() * 10000);
       order['customerID'] = customerID.toString();
       var first_itemID = Math.floor(Math.random() * 13) + 1;
       var popularMenu = [2, 5, 6, 13];
       if (!popularMenu.includes(first_itemID) && Math.random() < 0.25)
        var first_itemID = popularMenu[Math.floor(Math.random() * popularMenu.length)];
       order['itemID'] = first_itemID;
       var qty = 0;
       var qtyprob = Math.floor(Math.random() * 10);
       if(qtyprob < 5) qty = 1;
       if(qtyprob >= 5 && qtyprob < 8) qty = 2;
       if(qtyprob >= 8) qty = 3;
       order['itemQTY'] = qty;
       order['time_placed'] = new_date;
       order['time_fulfilled'] = fulfilled_date;
       order['time_cancelled'] = '';
       order['status'] = 'fulfilled';

       orders.push(order);

       var additional_rand = Math.floor(Math.random() * 10);

       //probability to calculate an additional order
       if(additional_rand < 3)
       {
         var order_addn = {};
         order_addn['orderID'] = orderID;
         order_addn['customerID'] = customerID.toString();
         var second_itemID = Math.floor(Math.random() * 13) + 1;
         if(second_itemID == first_itemID)
         {
           second_itemID++;
           if(second_itemID == 14) second_itemID == 1;
         }
         order_addn['itemID'] = second_itemID;
         var qty = 0;
         var qtyprob = Math.floor(Math.random() * 10);
         if(qtyprob < 5) qty = 1;
         if(qtyprob >= 5 && qtyprob < 8) qty = 2;
         if(qtyprob >= 8) qty = 3;
         order_addn['itemQTY'] = qty;
         order_addn['time_placed'] = new_date;
         order_addn['time_fulfilled'] = fulfilled_date;
         order_addn['time_cancelled'] = '';
         order_addn['status'] = 'fulfilled';

         orders.push(order_addn);
       }

       orderID++;
     }
   }
   var date = new_date;
 }
//console.log(orders)
 pushOrdersArray(orders);
}

// pendingOrders();
// cancelledOrders();
// fulfilledOrders();
// allOrders();
// var checkout = [{'customerID': '8820', 'itemID': 3, 'itemQTY': 1}];
// pushOrders(checkout);
// cancelOrder('5b38a89f81fdfd4bc845f950')
// fulfillOrder('5b38ad69e2f2bb1ccc98d12c')
// console.log(minutes(new Date()))
// minutes(new Date());
// createFakeData();
