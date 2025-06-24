## Currency Converter

This is an application to create users and conversion transactions. It uses NestJs, TypeORM and PostgreSQL.

Check API Swagger documentation `/api`

## Project setup

```bash
$ npm install
```

Create a `.env` file with your currency API key, ie:

```
CURRENCY_API_KEY=key_goes_here
```

## DB setup

Add DB values to your .env file, ie:

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=currency_converter (needs to be create locally)
```

## Compile and run the project

```bash
$ npm run start
```

## Run tests

```bash
$ npm run test
```

## Architectural Decisions

- User service will be as minimal as possible as they should only be associated with transactions, with no further data, this can be easily expanded.
- User is saved to user table in the DB
- Convert is a service that calls the currencyapi for rates and returns the toValue based on rate as well - this will be used by the transactions endpoint
- Transactions controller will create transactions associated to users by id and return all transactions for that user by establishing a relation with the user table
