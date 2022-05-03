class CustomerDAO {
    constructor(parameter) {
        this.dbConnection = parameter.dbConnection;
    }

    async getCustomersList() {
        const customerEntities = this.dbConnection.collection('customerEntities');
        const customers = await customerEntities.find({}).toArray();
        return customers;
    }

    async getCustomerFromAddress(address) {
        const agg = [
            {
                '$match': {
                    '$expr': {
                        '$eq': [
                            address, '$btcAdresses'
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
            console.log(error);
        }
    }
}

module.exports = CustomerDAO