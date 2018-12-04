# Introduction
This is the test for Skoove.
- There are different ways

## Starting Notes
- Have docker and docker compose at your machine
- Run docker-compose up -d
- Connect to the database and insert the .sql file under the /sql folder.
- Go to the _ consumer/server.js and the _ producer/server.js and press save to make nodejs update to their contents
- Go to POST http://0.0.0.0:8082/payment and make a {amount: number} request using {header: 'content-type':'application/json'}
- Go to GET http://0.0.0.0:81/statistics to retrieve statistics (of the last 20 min payments).


## A bit more about the approch to this problem
### First Approach
The first approach to solve this problem was by using Laravel and Laravel Queues through redis.
The following sequence was initially prefered.

- POST /payment -> Nginx Server -> Laravel -> Save key to Redis for quick stats -> Send Message to Queue -> Queue -> Executes Jobs -> Writes into DB
- GET /statistics -> nginx Server -> Laravel -> Read Redis Keys -> Presents results

However, it quickly became obvious that the monolithic Laravel approach was too slow to handle hundreds of requests per second.
Even with some techqniues such as using redis for Laravel caching and sessions system did not speed up the results a lot.

### Second Approach
The second approch is using Nodejs and RabbitMQ as a message broken to speed up the proceed.
The flow is as follows:

Option A:
- POST /payment -> NodeJS Server (Consumer) -> Redis Key for Quick Stats -> RabbitMQ -> NodeJS Producer -> Calls Laravel -> Writes into DB
OPTION B:
- POST /payment -> NodeJS Server (Consumer) -> Redis Key for Quick Stats -> RabbitMQ -> NodeJS Producer -> Writes into DB directly

The second approach was much more faster and stable.
