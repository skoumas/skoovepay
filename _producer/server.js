'use strict';
const express = require('express');
var amqp = require('amqplib/callback_api');
const app = express();
const axios = require('axios');
const PORT = 8080;
const HOST = "0.0.0.0";

amqp.connect('amqp://rabbitmq:rabbitmq@rabbitmq', function(err, conn) {
	conn.createChannel(function(err, ch) {
		var q = 'payment';
		ch.assertQueue(q, {durable: false});
		ch.consume(q, function(msg) {
			//method 1: CALL Laravel
			//axios.post("http://web/payment",{ "amount": msg.content.toString() },{headers:{"Content-Type":"application/json"}});
			//method 2: Straight into dB
			//axios.post("http://web/payment",{ "amount": msg.content.toString() },{headers:{"Content-Type":"application/json"}});

			var payment  = {amount: msg.content.toString() };
			var query = connection.query('INSERT INTO payments SET ?', payment, function(err, result) {

			});

			console.log(msg.content.toString());
		}, {noAck: true});

	});
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
