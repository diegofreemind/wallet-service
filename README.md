# Wallet Service 

## Context - Use case

Sellers need a way to organize their appointments based on business rules
such as client potential, geolocation, follow up meetings, bringing new customers, etc.

## Key points

* Scheduling
    * customer availability
    * seller availability - ok
    * time constraints ( weekend, commercial, holiday )
    * geolocation
    * confirmed appointments
    * non confirmed appointments

* Ranking
    * Sort customers by indicators
    * Bring strategy keypoints

## Considereations

* Start weekly agenda as active
* Daily update the visits as completed, rescheduled or cancelled
* Finish weekly agenda setting it to inactive

## Integrations

* Indicators
    * Buying's frequency
    * Percent of profit 
    * Potential of grow
    * Rentability x Fidelity

* Customer 
    * CRUD over Customer -> request to manager evaluation


* Strategy - business rules applied herein
    * balanced commitments ( follow up, new clients )
    * goals over time 


## Test and development 

### Pre requirements:

* Docker & Docker Composer
* Nodejs v8.11.3 or higher
* NPM or Yarn as package manager

Create a .env file in the project root folder containing the following attributes:
```
MONGO_HOST='mongodb://localhost/wallet'
PORT=8080
```

Install the application modules by running
```
yarn
```
or 
```
npm install
``` 

Initialize a mongodb instance for tests
```
docker run -d -p 27017:27017 -v ~/data/db:/data mongo
```

Run the tests
``` 
yarn test
```  
