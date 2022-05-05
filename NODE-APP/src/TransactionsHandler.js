const logger = require('./logger')

class TransactionsHandler {

    constructor(parameters) {
        this.dbConnection = parameters.dbConnection;
        this.customersAddresses = parameters.customersAddresses;
        this.btcSlotConfirmationsThreshold = parameters.btcSlotConfirmationsThreshold;
    }

    async storeTransactions(transactions) {

        const transactionCollection = this.dbConnection.collection('transactions');
        const transactionErrorCollection = this.dbConnection.collection('transactionsError');
        var ris = null;
        var txids = [];
        var duplicatedTxids = [];
        var conflictTxids = [];

        for (var transaction of transactions) {
            try {
                ris = await transactionCollection.updateOne(
                    { '_id': transaction.txid + '#' + transaction.vout },
                    {
                        $set: {
                            "involvesWatchonly": transaction.involvesWatchonly,
                            "account": transaction.account,
                            "address": transaction.address,
                            "category": transaction.category,
                            "amount": transaction.amount,
                            "label": transaction.label,
                            "confirmations": transaction.confirmations,
                            "blockhash": transaction.blockhash,
                            "blockindex": transaction.blockindex,
                            "blocktime": transaction.blocktime,
                            "txid": transaction.txid,
                            "vout": transaction.vout,
                            "walletconflicts": transaction.walletconflicts,
                            "time": transaction.time,
                            "timereceived": transaction.timereceived,
                            'bip125-replaceable': transaction['bip125-replaceable']
                        }
                    },
                    { upsert: true });

                if (ris.upsertedCount > 0 && ris.acknowledged == true) {
                    txids.push(ris.upsertedId);
                }
                if (ris.matchedCount > 0 && ris.acknowledged == true) {
                    duplicatedTxids.push(transaction.txid + '#' + transaction.vout);
                }
                if (ris.modifiedCount > 0) {
                    conflictTxids.push(ris.upsertedId);
                }

            } catch (error) {

                await transactionErrorCollection.insertOne({
                    '_id': transaction.txid + '#' + transaction.vout,
                    "address": transaction.address,
                    "category": transaction.category,
                    "amount": transaction.amount,
                    "label": transaction.label,
                    "confirmations": transaction.confirmations,
                    "blockhash": transaction.blockhash,
                    "blockindex": transaction.blockindex,
                    "blocktime": transaction.blocktime,
                    "txid": transaction.txid,
                    "vout": transaction.vout,
                    "walletconflicts": transaction.walletconflicts,
                    "time": transaction.time,
                    "timereceived": transaction.timereceived,
                    'bip125-replaceable': transaction['bip125-replaceable'],
                    "error": error
                });
            }
        }
        return { txids, duplicatedTxids };
    }

    async customerBalance(customerEntity) {

        const agg = [
            {
                '$match': {
                    '$expr': {
                        '$and': [
                            {
                                '$eq': [
                                    '$address', customerEntity.btcAddress
                                ]
                            }, {
                                '$gte': [
                                    '$confirmations', this.btcSlotConfirmationsThreshold
                                ]
                            }, {
                                '$or': [
                                    {
                                        '$eq': [
                                            '$category', 'receive'
                                        ]
                                    }, {
                                        '$eq': [
                                            '$category', 'send'
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                }
            }, {
                '$project': {
                    '_id': true,
                    'address': true,
                    'amount': true,
                    'category': true,
                    'confirmations': true
                }
            }, {
                '$group': {
                    '_id': '$address',
                    'balance': {
                        '$sum': '$amount'
                    },
                    'count': {
                        '$sum': 1
                    }
                }
            }
        ];

        try {
            const transactionsColl = this.dbConnection.collection('transactions');
            const ris = await transactionsColl.aggregate(agg).toArray();
            if (ris.length == 1) {
                return ris[0]
            }
            return undefined;

        } catch (error) {
            logger('exception',
                'TransactionHandler - customer balance' + error,
                4,
                this.dbConnection);
            return undefined;
        }
    }

    async getDepositedWithoutReference() {

        const agg = [
            {
                '$match': {
                    $expr: {
                      $and: [
                            {
                            $not: {$in: ['$address',this.customersAddresses]}},
                            {
                            $or:    [  
                                        {$eq: ['$category', 'send']},
                                        {$eq: ['$category', 'receive']}
                                    ]
                                },
                                {'$gte': ['$confirmations',this.btcSlotConfirmationsThreshold]}
                        ]
                    }
                }
            }, {
                '$project': {
                    '_id': true,
                    'address': true,
                    'amount': true,
                    'category': true,
                    'confirmations': true
                }
            }, {
                '$group': {
                    '_id': {},
                    'count': {
                        '$sum': 1
                    },
                    'balance': {
                        '$sum': '$amount'
                    }
                }
            }
        ];

        try {
            const transactionsColl = this.dbConnection.collection('transactions');
            const ris = await transactionsColl.aggregate(agg).toArray();

            if (ris.length == 1) {
                return ris[0]
            }
            return undefined;
        } catch (error) {
            logger('exception',
                'TransactionsHandler - depositedWithoutReference' + error,
                4,
                this.dbConnection);
            return undefined;
        }

    }

    async getSmallestLargestValidDeposid() {

        const agg = [
            {
                '$match': {
                    '$expr': {
                        '$and': [ {
                                '$gte': [
                                    '$confirmations', this.btcSlotConfirmationsThreshold
                                ]
                            }, {
                                '$eq': [
                                    '$category', 'receive'
                                ]
                            }
                        ]
                    }
                }
            }, {
                '$group': {
                    '_id': {},
                    'max': {
                        '$max': '$amount'
                    },
                    'min': {
                        '$min': '$amount'
                    }
                }
            }
        ];


        try {
            const transactionsColl = this.dbConnection.collection('transactions');
            const ris = await transactionsColl.aggregate(agg).toArray();

            if (ris.length == 1) {
                return ris[0]
            }
            return undefined;
        } catch (error) {
            logger('exception',
                'TransactionsHandler - getSmallestLargestValidDeposid' + error,
                4,
                this.dbConnection);
            return undefined;
        }
    }

}
module.exports = TransactionsHandler;