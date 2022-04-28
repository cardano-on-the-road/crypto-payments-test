const { MongoClient } = require('mongodb');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const TransactionReader = require('../src/TransactionReader');
const { default: transactionReader } = require('../src/TransactionReader');

let mongoClient = null;
const settingsPath = path.resolve(__dirname, '../local_settings.json');
const rawFile = fs.readFileSync(settingsPath);
const settings = JSON.parse(rawFile);

beforeEach(async () => {
    mongoClient = new MongoClient(settings.mongo_db_url);
});

describe('Mongo DB Tests', async () => {

    it('Connection test', async () => {
        try {
            await mongoClient.connect();
            assert(mongoClient);
        } catch (e) {
            console.error(e);
        } finally {
            await mongoClient.close();
        }
    })

    it('Read confirmation transaction', async () => {
        try {
            await mongoClient.connect();
            assert(mongoClient);
        } catch (e) {
            console.error(e);
        } finally {
            await mongoClient.close();
        }
    });

    it('Read customers list', async () => {
        const client = await mongoClient.connect();
        const db = client.db(settings.mongo_db_name);
        let collection = db.collection('customers');
        let customerList = await collection.find({}).toArray();
        assert.equal(customerList.length, 7)
        await mongoClient.close();
    });
});

describe('Transaction tests', async () => {
    it('Reading transaction', async () => {
        let transactions;
        const filesPath = path.resolve(__dirname, '../../DATA/');
        const transactionReader = new TransactionReader();
        transactionReader.readFiles(filesPath);
        transactions = transactionReader.getTransactions();

        console.log(transactions)

    })

    it('Save transactions', async () => {

    })
});