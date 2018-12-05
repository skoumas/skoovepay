# Introduction
This is the test for Skoove.
The system should be able to handle hundreds of requests per second and should be able to access statistics once every five seconds. With the use of REDIS we don't have to wait for statistics as they come straight away.

## How to Run
- Have docker and docker compose installed at your machine
- Run docker-compose up -d
- Connect to the database at port 3306 with the settings in docker-compose.yml and insert the .sql file under the /sql folder. That file should create three SQL tables ready to be used.
- The _ consumer and _ producer NODEJS servers will start in 10 seconds after the docker-compose initiated to ensure that RABBITMQ is up and running.
- Go to POST http://0.0.0.0:8082/payment and make a {amount: number} request using {header: 'content-type':'application/json'}. If the request is in bad format you should get wrong format reqponse.
- You can also make the same POST request at http://0.0.0.0:8081/payment. That request will go through LARAVEL directly.
- Go to GET http://0.0.0.0:81/statistics to retrieve statistics (of the last 20 min payments).
- Go to GET http://0.0.0.0:8082/statistics to retrieve statistics using the nodejs Version (of the last 20 min payments).
- The stresstest.jmx will provide you with the JMeter test file ready setup for your testing.

## End Points
- GET http://0.0.0.0:81/statistics   ( Laravel Statistics )
- GET http://0.0.0.0:8082/statistics ( Nodejs Statistics )
- POST http://0.0.0.0:8082/payment   ( Nodejs CREATE payment )
- POST http://0.0.0.0:81/payment     ( Laravel CREATE payment )

## A bit more about the approach to this problem
### First Approach
The first approach to solve this problem was by using Laravel and Laravel Queues through REDIS.
The following sequence was initially preferred.

- POST /payment -> NGINX Server -> Laravel -> Save key to Redis for quick stats -> Send Message to Queue -> Queue -> Executes Jobs -> Writes into DB
- GET /statistics -> NGINX Server -> Laravel -> Read REDIS Keys -> Presents results

However, it quickly became obvious that the monolithic Laravel approach was too slow to handle hundreds of requests per second.
Even with some techniques such as using REDIS for Laravel caching and sessions system did not speed up the results a lot.

### Second Approach
The second approach is using NODEJS and RabbitMQ as a message broken to speed up the proceed.
The flow is as follows:

Option A:
- POST /payment -> NodeJS Server (Consumer) -> REDIS Key for Quick Stats -> RabbitMQ -> NodeJS Producer -> Calls Laravel -> Writes into DB
OPTION B:
- POST /payment -> NodeJS Server (Consumer) -> REDIS Key for Quick Stats -> RabbitMQ -> NodeJS Producer -> Writes into DB directly

The second approach was much more faster and stable.

### TODOS
- Replace the Laravel Keys with an actual list instead. Or use the HSET method to store all the payment information.

## Flush REDIS
To FLUSH the REDIS please run:
- docker exec -it sp.redis bash
- redis-cli flushall
