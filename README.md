# Solution design

### Architecture
![](./IMG/solution-kr.jpeg)

## Assumptions
* Deposited balances are calculated `receive transactions - send transactions`
* transactions of categories `immature` and `generate` are omitted.
* A registered customer has a single wallet 

## What could be improved
* In this model a customer has a single BTC address. The application should handle multiple address for every account.

* implementing a circuit breaker to handle the connection with mongo db

