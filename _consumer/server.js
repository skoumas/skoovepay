'use strict';
const express = require('express');
var amqp = require('amqplib/callback_api');
const app = express();
const bodyParser = require("body-parser");
const axios = require('axios');
const PORT = 8080;
const HOST = "0.0.0.0";
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

amqp.connect('amqp://rabbitmq:rabbitmq@rabbitmq', function(err, conn) {
app.post('/payment', (req, res) => {
		if (err) {
			res.sendStatus(500);
		} else {
			if (req.body.amount==undefined || req.body == undefined ) {
				res.status(400);
				res.json({"error":'Wrong format'});
			 	process.exit(0);
			}

			conn.createChannel(function(err, ch) {
				var q = 'payment';
				var amount = req.body.amount;
				ch.assertQueue(q, {durable: false});
				ch.sendToQueue(q, new Buffer(amount.toString()));
				var redis = require('redis');
				var client = redis.createClient("6379","redis");
				client.on('connect', function() {
					let timestamp = Math.floor(Date.now() / 1000);
					// The better way is to use lpush and store in a list but we are going to make use of the EX setting in this eaxmple
					//client.lpush('payments', amount.toString())
					client.incr('id', function(err, id) {
					    client.set('p_' + id +  "_" + amount.toString(), amount.toString(), 'EX', 1200);
					});

				});
				res.sendStatus(201);
				//res.send("ok");
			});
		 	//setTimeout(function() { conn.close(); process.exit(0);  }, 500);
		}
	});
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);