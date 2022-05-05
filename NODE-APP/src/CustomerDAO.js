const logger = require('./logger');

class CustomerDAO {
    constructor(parameter) {
        this.dbConnection = parameter.dbConnection;
    }

    async getCustomersList() {
        const customerEntities = this.dbConnection.collection('customerEntities');
        const customers = await customerEntities.find({}).toArray();
        return customers;
    }

    async getCustomersAddresses(customers) {
        let customerAddresses = [];
        if (customers) {
            for (var customer of customers) {
                customerAddresses.push(customer.btcAddress);
            }
            return customerAddresses;
        }
        return [];
    }

    async getCustomerFromAddress(address) {
        const agg = [
            {
                '$match': {
                    '$expr': {
                        '$eq': [
                            address, '$btcAddress'
                        ]
                    }
                }
            }
        ];
        try {
            const customerEntities = this.dbConnection.collection('customerEntities');
            const customers = await customerEntities.aggregate(agg).toArray();
            if (customers.length == 1) {
                return customers[0];
            }
            return undefined;
        } catch (error) {
            logger('Exception', 'error', 4, this.dbConnection);
        }
    }
}

module.exports = CustomerDAO