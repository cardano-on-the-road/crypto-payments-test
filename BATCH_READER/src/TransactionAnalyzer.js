const { MongoClient } = require('mongodb');

class TransactionAnalyzer {

    constructor(transactions, minConfirmations, customerList, connectionString, dbName) {
        this.transactions = transactions;
        this.minConfirmations = minConfirmations;
        this.customerList = customerList;
        this.connectionString = connectionString;
        this.dbName = dbName
    }

    async storeTransactions() {
        const mongoClient = new MongoClient(this.connectionString);
        const client = mongoClient.connect();
        const db = client.db(this.dbName);
        const customerEntities = db.collection('customerEntities');
        const environmentVariables = db.collection('environmentVariables');
        const customerBtcAddresses = db.collection('customerBtcAddresses');

        const ris = await environmentVariables.findOne({ '_id': 'btcSlotConfirmations' });
        const btcSlotConfirmations = parseInt(ris.value);
        const customers = await customerEntities.find({}).toArray();
        

        var validatedTransactions = [];
        var pendingTransactions = [];
        var unknownTransactions = [];

        try {
            client
            this.transactions.forEach(async (transaction) => {
                ris = await customerBtcAddresses.findOne({ '_id': transaction.address })
                if (ris != undefined) {
                    if (transaction.confirmations >= btcSlotConfirmations) {
                        validatedTransactions.push(transaction);
                    }
                    else {
                        pendingTransactions.push(transaction);
                    }
                } else {
                    unknownTransactions.push(transaction)
                }
            });

            return true;
        } catch (err) {
            return false;
        } finally {
            mongoClient.close()
        }
    }

    #connect() {

    }
}

module.exports = TransactionAnalyzer;