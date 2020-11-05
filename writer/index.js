const JSONWriter = require('~/writer/json');
const CSVWriter = require('~/writer/csv');

class WriterManager {
    constructor () {
        this.defaultType = 'json';
        this.writers = {
            'json': new JSONWriter(),
            'csv': new CSVWriter()
        }
    }
    
    get (type) {
        return type && this.writers[type] ? this.writers[type] : this.writers[this.defaultType];
    }
}

module.exports = WriterManager;
