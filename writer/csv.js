const createCsvWriter = require('csv-writer').createObjectCsvWriter;

class CSVWriter {
    execute(filename, data, headers) {
        const keys = Object.keys(Array.isArray(data) ? data[0] : data);
        const csvWriter = createCsvWriter({
            path: `./dist/${filename}.csv`,
            header: headers || keys.map(key => ({
                id: key,
                title: key.charAt(0).toUpperCase() + key.slice(1)
            }))
        });
        csvWriter.writeRecords(data)
    }
}

module.exports = CSVWriter;
