'use strict';
const express = require('express');
var amqp = require('amqplib/callback_api');
const app = express();
const axios = require('axios');
const mysql = require('mysql');
const PORT = 8080;
const HOST = "0.0.0.0";

var connection = mysql.createConnection({
	host     : 'db',
	user     : 'skoovepay',
	password : 'CABinNYQRwu8XqcRqxdxQEAG',
	database : 'skoovepay'
});
connection.connect();
/**
* Listening to the payment queue we execute it and save into the database.
* There are two options here.
* Option 1: Call Laravel and save into DB
* Option 2: Save straight into MYSQL
*/
amqp.connect('amqp://rabbitmq:rabbitmq@rabbitmq', function(err, conn) {
	conn.createChannel(function(err, ch) {
		var q = 'payment';
		ch.assertQueue(q, {durable: false});
		ch.consume(q, function(msg) {
			//method 1: Call Laravel and save it from Lavavel
			//axios.post("http://web/payment_no_redis",{ "amount": msg.content.toString() },{headers:{"Content-Type":"application/json"}});

			//method 2: Straight into dB
			var payment  = {
				"amount": msg.content.toString(),
				"created_at": new Date(),
				"updated_at": new Date()
			};
			var query = connection.query('INSERT INTO payments SET ?', payment, function(err, result) {

			});
		}, {noAck: true});
	});
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
