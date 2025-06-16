# Currency-Converter project

# How to run this project

To run this project you need to install the docker and docker compose software into your machine.

With this software installed, clone this project into your machine.
Create the .env file in root folder project and copy all the variables in the .env.example file.
Fill the variables in the .env
After these steps run the follwing code:

`docker compose up -d --build`

# How to run the unit and integration test

When the containers is running, execute the following code:

`docker exec -it currency-converter /bin/bash`

You'll get in the currency-converter container. There you should run this code:

`npm run test`

# Explanation of purpose

This project is a currency conversion service that calculates exchange rates and applicable taxes.

The service currently supports conversions between these currencies:

- 🇧🇷 BRL (Brazilian Real)
- 🇺🇸 USD (US Dollar)
- 🇪🇺 EUR (Euro)
- 🇯🇵 JPY (Japanese Yen)

## Quick Start Example

Convert $100 USD to Brazilian Reais:

```bash
GET http://localhost:4000/transactions?userId=1&fromCurrency=USD&fromValue=100&toCurrency=BRL
```

# Key architectural decisions

The system follows a layered architecture pattern consisting of:

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic and application rules
- **Repositories**: Manage data persistence and database operations

This separation of concerns provides:

- Improved code readability
- Better maintainability
- Easier testing through clear boundaries
- Simplified debugging flow

This project implemented **SOLID principles** throughout the codebase to ensure:

- Single responsibility for each component
- Open/closed architecture for extensibility
- Liskov substitution compatibility
- Interface segregation for clean contracts
- Dependency injection for loose coupling

The architecture enables:

- Straightforward onboarding for new developers
- Isolated modification of components
- Clear data flow tracking
- Sustainable long-term maintenance
>>>>>>> dbab6b2 (Add the project descriptions.)
