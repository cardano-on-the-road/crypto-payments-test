const { MongoClient } = require('mongodb');

class MongoConnector {
    constructor(connectionParameters) {
        this.mongoDbUrl = connectionParameters.mongoDbUrl;
        this.mongoDbName = connectionParameters.mongoDbName;
        this.mongoClient = null
    }

    async getDbInstance() {
        this.mongoClient = new MongoClient(this.mongoDbUrl);
        await this.mongoClient.connect();
        const db = this.mongoClient.db(this.mongoDbName);
        return db;
    }

    async closeConnection() {
        if (this.mongoClient) {
            await this.mongoClient.close();
        }
    }
}

module.exports = MongoConnector;