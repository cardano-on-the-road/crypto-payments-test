const MongoConnector = require('../src/MongoConnector');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const TransactionsReader = require('../src/TransactionsReader');
const TransactionsHandler = require('../src/TransactionsHandler');
const CustomerDAO = require('../src/CustomerDAO');
const logger = require('../src/logger');


const settingsPath = path.resolve(__dirname, './test_settings.json');
const rawFile = fs.readFileSync(settingsPath);
const settings = JSON.parse(rawFile);

beforeEach(async () => {
    // mongoConnector = new MongoConnector({
    //     'mongoDbUrl': settings.mongo_db_url,
    //     'mongoDbName': settings.mongo_db_name
    // });
    // dbConnection = await mongoConnector.getDbInstance();
});

describe('Mongo DB Tests', async () => {

    it('Connection test', async () => {
        const mongoConnector = new MongoConnector({
            'mongoDbUrl': settings.mongo_db_url,
            'mongoDbName': settings.mongo_db_name
        });
        const dbConnection = await mongoConnector.getDbInstance();

        await mongoConnector.closeConnection();
        assert(dbConnection);

    })

    it('Read confirmation transaction', async () => {

        const mongoConnector = new MongoConnector({
            'mongoDbUrl': settings.mongo_db_url,
            'mongoDbName': settings.mongo_db_name
        });
        const dbConnection = await mongoConnector.getDbInstance();

        let collection = dbConnection.collection('environmentVariables');
        const ris = await collection.findOne({ '_id': 'btcSlotConfirmations' });
        const btcSlotConfirmationsThreshold = parseInt(ris.value);
        await mongoConnector.closeConnection();
        assert.equal(btcSlotConfirmationsThreshold, 6);
    });



    it('Get BTC customer Address', async () => {

        const mongoConnector = new MongoConnector({
            'mongoDbUrl': settings.mongo_db_url,
            'mongoDbName': settings.mongo_db_name
        });
        const dbConnection = await mongoConnector.getDbInstance();

        const customerEntities = dbConnection.collection('customerEntities');
        let customer = await customerEntities.findOne({ 'taxIdCode': "4" });
        mongoConnector.closeConnection();
        assert.equal(customer.btcAddress, '2N1SP7r92ZZJvYKG2oNtzPwYnzw62up7mTo');

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

        const mongoConnector = new MongoConnector({
            'mongoDbUrl': settings.mongo_db_url,
            'mongoDbName': settings.mongo_db_name
        });
        const dbConnection = await mongoConnector.getDbInstance();

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
        await mongoConnector.closeConnection();
        assert.equal(ris.txids.length + ris.duplicatedTxids.length, readerResult.transactions.length);
        
    })

    it('Balance for user', async () => {
        const mongoConnector = new MongoConnector({
            'mongoDbUrl': settings.mongo_db_url,
            'mongoDbName': settings.mongo_db_name
        });
        const dbConnection = await mongoConnector.getDbInstance();
        
        let environmentVariables = dbConnection.collection('environmentVariables');
        let ris = await environmentVariables.findOne({ '_id': 'btcSlotConfirmations' });
        const btcSlotConfirmationsThreshold = parseInt(ris.value);

        const customerDAO = new CustomerDAO({dbConnection});

        const customersAddresses = await customerDAO.getCustomersAddresses();
        
        const transactionsHandler = new TransactionsHandler({dbConnection, 
            customersAddresses, 
            btcSlotConfirmationsThreshold});

        const customer = {  "_id": "1",  "taxIdCode": "1",  "name": "Wesley",  "lastname": "Crusher",  "btcAddress": "mvd6qFeVkqH6MNAS2Y2cLifbdaX5XUkbZJ"}    
        ris = await transactionsHandler.customerBalance(customer);
        assert.equal(ris.balance, 183);
        assert.equal(ris.count, 35);
        
        await mongoConnector.closeConnection();
    })

    it('Smallest largest valid deposit', async () => {
        const mongoConnector = new MongoConnector({
            'mongoDbUrl': settings.mongo_db_url,
            'mongoDbName': settings.mongo_db_name
        });
        const dbConnection = await mongoConnector.getDbInstance();

        let environmentVariables = dbConnection.collection('environmentVariables');
        const ris = await environmentVariables.findOne({ '_id': 'btcSlotConfirmations' });
        const btcSlotConfirmationsThreshold = parseInt(ris.value);

        const customerDAO = new CustomerDAO({dbConnection});

        const customersAddresses = await customerDAO.getCustomersAddresses();
        
        const transactionsHandler = new TransactionsHandler({dbConnection, 
            customersAddresses, 
            btcSlotConfirmationsThreshold});

        const minMax = await transactionsHandler.getSmallestLargestValidDeposid();

        assert.equal(minMax.min, 0);
        assert.equal(minMax.max, 99.61064066);
            
        await mongoConnector.closeConnection();

    })

    it('Deposit without reference', async () => {
        const mongoConnector = new MongoConnector({
            'mongoDbUrl': settings.mongo_db_url,
            'mongoDbName': settings.mongo_db_name
        });
        const dbConnection = await mongoConnector.getDbInstance();

        let environmentVariables = dbConnection.collection('environmentVariables');
        let ris = await environmentVariables.findOne({ '_id': 'btcSlotConfirmations' });
        const btcSlotConfirmationsThreshold = parseInt(ris.value);

        const customerDAO = new CustomerDAO({dbConnection});

        const customersAddresses = await customerDAO.getCustomersAddresses();
        
        const transactionsHandler = new TransactionsHandler({dbConnection, 
            customersAddresses, 
            btcSlotConfirmationsThreshold});

        ris = await transactionsHandler.getDepositedWithoutReference();

        assert.equal(ris.count, 52);
        assert.equal(ris.balance, 12.26702683000002);

        mongoConnector.closeConnection();
    })

});

describe('Customers', async () => {

    it('Read customers list', async () => {

        const mongoConnector = new MongoConnector({
            'mongoDbUrl': settings.mongo_db_url,
            'mongoDbName': settings.mongo_db_name
        });
        const dbConnection = await mongoConnector.getDbInstance();

        const customerDAO = new CustomerDAO(           {
            'dbConnection': dbConnection
        });
        const customerList = await customerDAO.getCustomersList();
        await mongoConnector.closeConnection();
        assert.equal(customerList.length, 7);
    });

    it ('Customer from address', async () => {

        const mongoConnector = new MongoConnector({
            'mongoDbUrl': settings.mongo_db_url,
            'mongoDbName': settings.mongo_db_name
        });
        const dbConnection = await mongoConnector.getDbInstance();

        const customerDAO = new CustomerDAO(           {
            'dbConnection': dbConnection
        });
        let ris = await customerDAO.getCustomerFromAddress('mvd6qFeVkqH6MNAS2Y2cLifbdaX5XUkbZJ');
        assert.equal(ris.name, 'Wesley')

        ris = await customerDAO.getCustomerFromAddress('000000000');
        await mongoConnector.closeConnection();
        assert.equal(ris, undefined);
    });
})

describe('Logs', async () => {

    it('test insert log', async () => {
        const mongoConnector = new MongoConnector({
            'mongoDbUrl': settings.mongo_db_url,
            'mongoDbName': settings.mongo_db_name
        });
        const dbConnection = await mongoConnector.getDbInstance();
        const logCollection = dbConnection.collection('logs');
        //await logCollection.deleteMany({});

        await logger('info', 'log test1', 0, dbConnection);
        await logger('info', 'log test2', 0, dbConnection);

        const logs = await logCollection.find({}).toArray();
        
        await mongoConnector.closeConnection();
        //assert.equal(logs[1].msg, 'log test2')

    });
});

