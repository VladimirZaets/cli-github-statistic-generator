const JSONWriter = require('~/writer/json');
const CSVWriter = require('~/writer/csv');
const fs = require('fs');

class WriterManager {
    constructor () {
        if (!fs.existsSync(`./dist`)){
            fs.mkdirSync('./dist')
        }
        
        this.defaultType = 'json';
        this.writers = {
            'json': new JSONWriter(),
            'csv': new CSVWriter()
        }
    }

    get (type) {
        const tp = type.toLowerCase();
        return type && this.writers[tp] ? this.writers[tp] : this.writers[this.defaultType];
    }
}

module.exports = WriterManager;
