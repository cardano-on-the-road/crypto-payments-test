const MongoConnector = require('../src/MongoConnector');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const TransactionsReader = require('../src/TransactionsReader');
const TransactionsHandler = require('../src/TransactionsHandler');
const CustomerDAO = require('../src/CustomerDAO');


let mongoConnector = null;
let dbConnection = null;
const settingsPath = path.resolve(__dirname, '../local_settings.json');
const rawFile = fs.readFileSync(settingsPath);
const settings = JSON.parse(rawFile);

beforeEach(async () => {
    mongoConnector = new MongoConnector({
        'mongoDbUrl': settings.mongo_db_url,
        'mongoDbName': settings.mongo_db_name
    });
    dbConnection = await mongoConnector.getDbInstance();
});

describe('Mongo DB Tests', async () => {

    it('Connection test', async () => {
        assert(dbConnection);
        mongoConnector.closeConnection();
    })

    it('Read confirmation transaction', async () => {
        let collection = dbConnection.collection('environmentVariables');
        const ris = await collection.findOne({ '_id': 'btcSlotConfirmations' });
        const btcSlotConfirmations = parseInt(ris.value);
        assert.equal(btcSlotConfirmations, 6);
        mongoConnector.closeConnection();
    });

    it('Read customers list', async () => {
        let collection = dbConnection.collection('customerEntities');
        let customerList = await collection.find({}).toArray();
        assert.equal(customerList.length, 7);
        mongoConnector.closeConnection();
    });

    it('BTC customer Address', async () => {
        const customerEntities = dbConnection.collection('customerEntities');
        let customer = await customerEntities.findOne({ 'taxIdCode': "4" });
        assert.equal(customer.btcAdresses[0], '2N1SP7r92ZZJvYKG2oNtzPwYnzw62up7mTo');
        mongoConnector.closeConnection();
    })

});

describe('Transaction tests', async () => {

    it('Reading transaction', async () => {
        const filesPath = path.resolve(__dirname, './DATA-TEST/');
        const transactionsReader = new TransactionsReader(filesPath);
        var readerResult = transactionsReader.filesReader();
        assert.equal(readerResult.transactions.length, 316);

    })

    it('Store transactions', async () => {
        const filesPath = path.resolve(__dirname, './DATA-TEST/');

        const transactions = dbConnection.collection('transactions');
        transactions.deleteMany({});

        const transactionsReader = new TransactionsReader(filesPath);
        var readerResult = transactionsReader.filesReader();

        const transactionsHandler = new TransactionsHandler(
            {
                'dbConnection': dbConnection
            });

        const ris = await transactionsHandler.storeTransactions(readerResult.transactions);
        console.log('Stored Lenght',ris.length, 'Reader lenght', readerResult.transactions.length);
        assert.equal(ris.txids.length + ris.duplicatedTxids.length, readerResult.transactions.length);
    })

    it('Balance for user', async () => {

    })

});

describe('Customers', async () => {

    it('Address list', async () => {

    });

    it ('Customer from address', async () => {
        const customerDAO = new CustomerDAO(           {
            'dbConnection': dbConnection
        });
        let ris = await customerDAO.getCustomerFromAddress('mvd6qFeVkqH6MNAS2Y2cLifbdaX5XUkbZJ');
        assert.equal(ris.name, 'Wesley')

        ris = await customerDAO.getCustomerFromAddress('000000000');
        assert.equal(ris, undefined);
    });
})