db = db.getSiblingDB('customers-transactions');

db.createCollection('customerEntities');
db.createCollection('transactions');
db.createCollection('logs');
db.createCollection('environmentVariables');



db.environmentVariables.insertOne({
    "_id": "btcSlotConfirmations",
    "value": "6"
});



db.customerEntities.insertMany([
    {
        "_id": "1",
        "taxIdCode": "1",
        "name": "Wesley",
        "lastname": "Crusher",
        "btcAddress": "mvd6qFeVkqH6MNAS2Y2cLifbdaX5XUkbZJ"
    },
    {
        "_id": "2",
        "taxIdCode": "2",
        "name": "Leonard",
        "lastname": "McCoy",
        "btcAddress": "mmFFG4jqAtw9MoCC88hw5FNfreQWuEHADp"
    },
    {
        "_id": "3",
        "taxIdCode": "3",
        "name": "Jonathan",
        "lastname": "Archer",
        "btcAddress": "mzzg8fvHXydKs8j9D2a8t7KpSXpGgAnk4n"
    },
    {
        "_id": "4",
        "taxIdCode": "4",
        "name": "Jadzia",
        "lastname": "Dax",
        "btcAddress": "2N1SP7r92ZZJvYKG2oNtzPwYnzw62up7mTo"
    },
    {
        "_id": "5",
        "taxIdCode": "5",
        "name": "Montgomery",
        "lastname": "Scott",
        "btcAddress": "mutrAf4usv3HKNdpLwVD4ow2oLArL6Rez8"
    },
    {
        "_id": "6",
        "taxIdCode": "6",
        "name": "James T.",
        "lastname": "Kirk",
        "btcAddress": "miTHhiX3iFhVnAEecLjybxvV5g8mKYTtnM"
    },
    {
        "_id": "7",
        "taxIdCode": "7",
        "name": "",
        "lastname": "Spock",
        "btcAddress": "mvcyJMiAcSXKAEsQxbW9TYZ369rsMG6rVV"
    }
]);