
const logger = async (category, msg, severity, dbConnection) => {
    const logs = dbConnection.collection('logs');
    return await logs.insertOne({
        msg: msg,
        category: category,
        severity: severity, 
        timestamp: new Date().valueOf()
    });  
}

module.exports = logger;
