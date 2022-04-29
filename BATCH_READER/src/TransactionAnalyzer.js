const { MongoClient } = require('mongodb');

class TransactionAnalyzer{

    constructor(transactions, minConfirmations, customerList, connectionString){
        this.transactions = transactions;
        this.minConfirmations = minConfirmations;
        this.customerList = customerList;
        this.connectionString = connectionString;
    }

    async storeTransactions(){
        const mongoClient = new MongoClient(this.connectionString);
        try{
            this.transactions.forEach(transaction => {
                
            });
            return true;
        }catch(err){
            return false;
        }finally{
            mongoClient.close()
        }
    }

    #connect(){

    }
}

module.exports=TransactionAnalyzer;