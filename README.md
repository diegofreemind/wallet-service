# Wallet Service 

## Context - Use case

Sellers need a way to organize their appointments based on business rules
such as client potential, geolocation, follow up meetings, bringing new customers, etc.


### Pre requirements:

* Docker & Docker Composer
* Nodejs v12.10.0 or higher
* NPM or Yarn as package manager

Create a .env file in the project root folder containing the following attributes:

```
MONGO_HOST='mongodb://localhost'
DATABASE='wallet-strategy'
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

## Integrations - roadmap

* Indicators
    * Buying's frequency
    * Percent of profit 
    * Potential of grow
    * Rentability x Fidelity

* Strategy - business rules applied herein
    * balanced commitments ( follow up, new clients )
    * goals over time 
