db = db.getSiblingDB('customers-transactions');

db.createCollection('customers');
db.createCollection('environmentVariables');

db.settings.insertOne({
    "btcSlotConfirmations": 6
});

db.customers.insertMany([
    {
        "taxIdCode": "1",
        "name": "Wesley",
        "lastname": "Crusher",
        "btcAdresses": ["mvd6qFeVkqH6MNAS2Y2cLifbdaX5XUkbZJ"]
    },
    {
        "taxIdCode": "2",
        "name": "Leonard",
        "lastname": "McCoy",
        "btcAdresses": ["mmFFG4jqAtw9MoCC88hw5FNfreQWuEHADp"]
    },
    {
        "taxIdCode": "3",
        "name": "Jonathan",
        "lastname": "Archer",
        "btcAdresses": ["mzzg8fvHXydKs8j9D2a8t7KpSXpGgAnk4n"]
    },
    {
        "taxIdCode": "4",
        "name": "Jadzia",
        "lastname": "Dax",
        "btcAdresses": ["2N1SP7r92ZZJvYKG2oNtzPwYnzw62up7mTo"]
    },
    {
        "taxIdCode": "5",
        "name": "Montgomery",
        "lastname": "Scott",
        "btcAdresses": ["mutrAf4usv3HKNdpLwVD4ow2oLArL6Rez8"]
    },
    {
        "taxIdCode": "6",
        "name": "James T.",
        "lastname": "Kirk",
        "btcAdresses": ["miTHhiX3iFhVnAEecLjybxvV5g8mKYTtnM"]
    },
    {
        "taxIdCode": "7",
        "name": "",
        "lastname": "Spock",
        "btcAdresses": ["mvcyJMiAcSXKAEsQxbW9TYZ369rsMG6rVV"]
    }
]);