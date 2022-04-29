const fs = require('fs');
const path = require('path');

class TransactionsReader {

    constructor(dirname) {
        this.dirname = dirname;
    }

    filesReader() {
        var transactions = [];
        var errors = [];
        var filenames = [];
        var filePath, fileContent;

        try {
            filenames = fs.readdirSync(this.dirname);
            filenames.forEach((filename) => {
                filePath = path.resolve(this.dirname, filename);
                fileContent = JSON.parse(fs.readFileSync(filePath));
                transactions = [...transactions, ...fileContent.transactions];
            });

        } catch (error) {
            errors.push(error)
        } finally {
            return { transactions, errors, filenames }
        }
    }
}


module.exports = TransactionsReader;