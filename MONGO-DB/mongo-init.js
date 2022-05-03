db = db.getSiblingDB('customers-transactions');

db.createCollection('customerEntities');
db.createCollection('transactions');
//db.createCollection('customerBtcAddresses');
//db.createCollection('customerBalances');
db.createCollection('environmentVariables');

// db.createCollection('validatedTransactions');
// db.createCollection('pendingTransaction');
// db.createCollection('unknownTransactions');

db.environmentVariables.insertOne({
    "_id": "btcSlotConfirmations",
    "value": "6"
});

// db.customerBtcAddresses.insertMany([

//     { "_id": "mvd6qFeVkqH6MNAS2Y2cLifbdaX5XUkbZJ", taxCode: "1" },
//     { "_id": "mmFFG4jqAtw9MoCC88hw5FNfreQWuEHADp", taxCode: "2" },
//     { "_id": "mzzg8fvHXydKs8j9D2a8t7KpSXpGgAnk4n", taxCode: "3" },
//     { "_id": "2N1SP7r92ZZJvYKG2oNtzPwYnzw62up7mTo", taxCode: "4" },
//     { "_id": "mutrAf4usv3HKNdpLwVD4ow2oLArL6Rez8", taxCode: "5" },
//     { "_id": "miTHhiX3iFhVnAEecLjybxvV5g8mKYTtnM", taxCode: "6" },
//     { "_id": "mvcyJMiAcSXKAEsQxbW9TYZ369rsMG6rVV", taxCode: "7" }
// ]);

// db.customerBtcAddresses.insertMany([

//     { "_id": "1", taxCode: "1", btcAdresses: ["mvd6qFeVkqH6MNAS2Y2cLifbdaX5XUkbZJ"] },
//     { "_id": "2", taxCode: "2", btcAdresses: ["mvd6qFeVkqH6MNAS2Y2cLifbdaX5XUkbZJ"] },
//     { "_id": "3", taxCode: "3", btcAdresses: ["mvd6qFeVkqH6MNAS2Y2cLifbdaX5XUkbZJ"] },
//     { "_id": "4", taxCode: "4", btcAdresses: ["mvd6qFeVkqH6MNAS2Y2cLifbdaX5XUkbZJ"] },
//     { "_id": "5", taxCode: "5", btcAdresses: ["mvd6qFeVkqH6MNAS2Y2cLifbdaX5XUkbZJ"] },
//     { "_id": "6", taxCode: "6", btcAdresses: ["mvd6qFeVkqH6MNAS2Y2cLifbdaX5XUkbZJ"] },
//     { "_id": "7", taxCode: "7", btcAdresses: ["mvd6qFeVkqH6MNAS2Y2cLifbdaX5XUkbZJ"] }
// ]);

db.customerEntities.insertMany([
    {
        "_id": "1",
        "taxIdCode": "1",
        "name": "Wesley",
        "lastname": "Crusher",
        "btcAdresses": ["mvd6qFeVkqH6MNAS2Y2cLifbdaX5XUkbZJ"]
    },
    {
        "_id": "2",
        "taxIdCode": "2",
        "name": "Leonard",
        "lastname": "McCoy",
        "btcAdresses": ["mmFFG4jqAtw9MoCC88hw5FNfreQWuEHADp"]
    },
    {
        "_id": "3",
        "taxIdCode": "3",
        "name": "Jonathan",
        "lastname": "Archer",
        "btcAdresses": ["mzzg8fvHXydKs8j9D2a8t7KpSXpGgAnk4n"]
    },
    {
        "_id": "4",
        "taxIdCode": "4",
        "name": "Jadzia",
        "lastname": "Dax",
        "btcAdresses": ["2N1SP7r92ZZJvYKG2oNtzPwYnzw62up7mTo"]
    },
    {
        "_id": "5",
        "taxIdCode": "5",
        "name": "Montgomery",
        "lastname": "Scott",
        "btcAdresses": ["mutrAf4usv3HKNdpLwVD4ow2oLArL6Rez8"]
    },
    {
        "_id": "6",
        "taxIdCode": "6",
        "name": "James T.",
        "lastname": "Kirk",
        "btcAdresses": ["miTHhiX3iFhVnAEecLjybxvV5g8mKYTtnM"]
    },
    {
        "_id": "7",
        "taxIdCode": "7",
        "name": "",
        "lastname": "Spock",
        "btcAdresses": ["mvcyJMiAcSXKAEsQxbW9TYZ369rsMG6rVV"]
    }
]);