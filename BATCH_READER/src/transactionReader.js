const fs = require('fs');
const path = require('path');

let fi = undefined;
let co = undefined;

function onFileContent(f, c) {
    fi = f
    co = c
    console.log(co);
}

function transactionsReader(dirname, onFileContent, onError) {
    fs.readdir(dirname, function (err, filenames) {
        if (err) {
            onError(err);
            return;
        }
        let filePath;
        filenames.forEach(function (filename) {
            filePath = path.resolve(dirname, filename);
            fs.readFile(filePath, 'utf-8', function (err, content) {
                if (err) {
                    onError(err);
                    return;
                }
                onFileContent(filename, content);
            });
        });
    });
}

class TransactionReader {

    constructor() {
        this.transactions = [];
        this.filePaths = [];
        this.errors = []
    }

    readFiles(dirname) {
        fs.readdir(dirname, function (err, filenames) {
            if (err) {
                throw err;
            }
            let filePath;
            filenames.forEach(function (filename) {
                try {
                    filePath = path.resolve(dirname, filename);
                    fs.readFile(filePath, 'utf-8', function (err, content) {
                        if (err) {
                            onError(err);
                            return;
                        }
                        contentObj = JSON.parse(content);
                        this.filePath.push=filePath;
                    });
                } catch (error) {
                    this.errors.push(errors);
                }

            });
        });
    }
}

transactionReader('../../DATA', onFileContent, (err) => { console.log(err) });

//export default transactionReader;