const { MongoClient } = require('mongodb');

class MongoConnector{
    constructor(connectionParameters){
        this.mongoDbUrl = connectionParameters.mongoDbUrl;
        this.mongoDbName = connectionParameters.mongoDbName;
        this.mongoClient = new MongoClient(this.mongoDbUrl);
    }
 
    async getDbInstance(){
        await this.mongoClient.connect();
        const db = this.mongoClient.db(this.mongoDbName);
        return db;
    }

    async closeConnection(){
        await this.MongoClient.close();
    }


}

module.exports = MongoConnector;