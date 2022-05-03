

class TransactionsHandler {

    constructor(parameters) {
        this.dbConnection = parameters.dbConnection;
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

                if (ris.upsertedCount > 0 && ris.acknowledged == true)  {
                    txids.push(ris.upsertedId);
                }
                if (ris.matchedCount>0 && ris.acknowledged == true) {
                    duplicatedTxids.push(transaction.txid + '#' + transaction.vout);
                }
                if (ris.modifiedCount>0) {
                    conflictTxids.push(ris.upsertedId);
                }

            } catch (error) {
                console.log(error);
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
        return {txids, duplicatedTxids};
    }

    async customerReport(customerEntity) {

    }
}
module.exports = TransactionsHandler;