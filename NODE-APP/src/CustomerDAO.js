const logger = require('./logger');

class CustomerDAO {
    constructor(parameter) {
        this.dbConnection = parameter.dbConnection;
    }

    async getCustomersList() {
        const customersCollection = this.dbConnection.collection('customers');
        const customers = await customersCollection.find({}).toArray();
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
        try {
            const customerColl = this.dbConnection.collection('customers');
            let customer =  await customerColl.findOne({'btcAddress': address}); 
            return customer;

        } catch (error) {
            logger('Exception', 'error', 4, this.dbConnection);
        }
    }
}

module.exports = CustomerDAO