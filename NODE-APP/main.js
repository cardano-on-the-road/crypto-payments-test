const MongoConnector = require('./src/MongoConnector');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const TransactionsReader = require('./src/TransactionsReader');
const TransactionsHandler = require('./src/TransactionsHandler');
const CustomerDAO = require('./src/CustomerDAO');
const logger = require('./src/logger');

const getName = (customer) => {
    
    if(Boolean(customer.name) && Boolean(customer.lastname)){
        return customer.name +' '+ customer.lastname
    }
    else {
        return customer.lastname;
    }

} 

const main = async () => {



    const settingsPath = path.resolve(__dirname, './settings.json');
    const rawFile = fs.readFileSync(settingsPath);
    const settings = JSON.parse(rawFile);

    const mongoConnector = new MongoConnector({
        'mongoDbUrl': settings.mongo_db_url,
        'mongoDbName': settings.mongo_db_name
    });
    const dbConnection = await mongoConnector.getDbInstance();

    await logger('info', 'mongodb connection opened', 0, dbConnection);

    //BTC Slot confirmation
    let environmentVariables = dbConnection.collection('environmentVariables');
    let ris = await environmentVariables.findOne({ '_id': 'btcSlotConfirmations' });
    const btcSlotConfirmationsThreshold = parseInt(ris.value);
    await logger('info', 'btcSlotConfirmationsThreshold: ' + btcSlotConfirmationsThreshold, 0, dbConnection);


    //Customers list
    const customerDAO = new CustomerDAO({
        'dbConnection': dbConnection
    });
    const customers = await customerDAO.getCustomersList();

    const customersAddresses = await customerDAO.getCustomersAddresses(customers);


    //Reading and storing transactions
    const dataPath = path.resolve(__dirname, settings.data_folder_name);
    const transactionsReader = new TransactionsReader(dataPath);
    var readerResult = transactionsReader.filesReader();

    await logger('info', 'Reading transactions from files with ' + readerResult.errors.length + ' errors' , 1, dbConnection);
    if(readerResult.errors.length > 0){
        await logger('exception', 'Reading transactions from file: ' + readerResult.errors, 4, dbConnection);
    }
    const transactionsHandler = new TransactionsHandler({dbConnection, 
        customers, 
        btcSlotConfirmationsThreshold});

    if (readerResult.transactions){
        await transactionsHandler.storeTransactions(readerResult.transactions);
        await logger('info', 'Saving transaction completed', 0, dbConnection);
    }

    //Print customer balance
    var customerBalance;
    if (customers) {
        for (var customer of customers) {
            customerBalance = await transactionsHandler.customerBalance(customer);
            console.log('Deposited for ' + getName(customer) + ': ' + 'count=' + customerBalance.count +' sum=' + customerBalance.balance);
        }
    }

    //Deposited without reference

    //Smallest and largest deposited

    await logger('info', 'Closing connection successfully', 0, dbConnection);
    await mongoConnector.closeConnection();
    

}

main();