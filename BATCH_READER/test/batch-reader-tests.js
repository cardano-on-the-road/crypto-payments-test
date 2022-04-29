const { MongoClient } = require('mongodb');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const TransactionsReader = require('../src/TransactionsReader');
const TransactionAnalyzer = require('../src/TransactionAnalyzer');


let mongoClient = null;
const settingsPath = path.resolve(__dirname, '../local_settings.json');
const rawFile = fs.readFileSync(settingsPath);
const settings = JSON.parse(rawFile);

beforeEach(async () => {
    mongoClient = new MongoClient(settings.mongo_db_url);
});

describe('Mongo DB Tests', async () => {

    it('Connection test', async () => {
        await mongoClient.connect();
        assert(mongoClient);
        await mongoClient.close();
    })

    it('Read confirmation transaction', async () => {
        await mongoClient.connect();
        const db = mongoClient.db(settings.mongo_db_name);
        let collection = db.collection('environmentVariables');
        const ris = await collection.findOne({'_id':'btcSlotConfirmations'})
        assert.equal(parseInt(ris.value), 6);
        await mongoClient.close();
    });

    it('Read customers list', async () => {
        const client = await mongoClient.connect();
        const db = client.db(settings.mongo_db_name);
        let collection = db.collection('customerEntities');
        let customerList = await collection.find({}).toArray();
        assert.equal(customerList.length, 7)
        await mongoClient.close();
    });

    it('BTC Address to customer relation', async () => {
        const client = await mongoClient.connect();
        const db = client.db(settings.mongo_db_name);
        const customerEntities = db.collection('customerEntities');
        const customerBtcAddresses = db.collection('customerBtcAddresses');
        let queryRes = await customerBtcAddresses.findOne({'_id':'mzzg8fvHXydKs8j9D2a8t7KpSXpGgAnk4n'});
        let customer = await customerEntities.findOne({'_id': queryRes.taxCode});
        assert.equal(customer.name, 'Jonathan');
        await mongoClient.close()
    })
});

describe('Transaction tests', async () => {
    
    it('Reading transaction', async () => {
        const filesPath = path.resolve(__dirname, './DATA-TEST/');
        const transactionsReader = new TransactionsReader(filesPath);
        var readerResult = transactionsReader.filesReader();
        assert.equal(readerResult.transactions.length, 8);

    })

    it('Save transactions', async () => {
        const filesPath = path.resolve(__dirname, './DATA-TEST/');
        const transactionsReader = new TransactionsReader(filesPath);
        var readerResult = transactionsReader.filesReader();
        //const TransactionAnalyzer = new TransactionAnalyzer(readerResult.transactions);
        

    })
});