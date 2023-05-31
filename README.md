# Moneyhub Tech Test - Investments and Holdings

## Updated README

At Moneyhub we use microservices to partition and separate the concerns of the codebase.
In this case the admin service backs a front end admin tool allowing non-technical staff to interact with data.

A request for a new admin feature was received and has now been actioned.

## Getting Started

To develop against all the services each one will need to be started in each service. Use the following commands to `run` each service:

```bash
npm start
#or
npm run develop
```

The `develop` command will run nodemon allowing you to make changes without restarting.

The services will try to use ports 8081, 8082 and 8083
## Testing

### Postman

Trigger the following endpoints:

```bash
`localhost:8083/all-user-holdings` - running a GET request to this new endpoint will generate a `fetchAllUserHoldings.csv` file. Its contents can also be seen in the response body
`localhost:8083/exports` - running a POST request to this existing endpoint will now send the csv report as application/JSON to the investments service
```

### Unit Tests

Run `npm run test` in the admin microservice.  

## Future

  1. How might you make this service more secure?
     1. I would ensure the new endpoints are also handled with the existing middleware that covers permissions etc.
     2. I would also look into whether this also handles authorisation and authentication.
     3. Perhaps some encryption/password protection on the CSV file - since this is covering financial data, it would be good to ensure this is secure.

  2. How would you make this solution scale to millions of records?
     1. Add protobufs (protocol buffers) to define strongly typed Proto message with structure of request, its data types and respective methods, and also reduce the size of the data being sent.
     2. Use gRPC - this would be able to serve many more requests concurrently
     3. Implement a load balancer - this would be able to distribute the requests across multiple servers to avoid overloading a single server

  3. What else would you have liked to improve given more time?
     1. I would have liked to implement Ramda.js - I have seen it used in the investments microservice and would like to explore it further in the future.
     2. I would have liked to implement additional and more descriptive test cases - for example, an empty POST request or checking the updated properties to ensure they are as requested.
