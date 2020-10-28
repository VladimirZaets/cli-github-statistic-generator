const fs = require('fs');

class JSONWriter {
    execute (filename, data) {
        fs.writeFile(`./dist/${filename}.json`, JSON.stringify(data, null, '\t'), function (err) {
            if (err) return console.log(err);
        });
    }
}

module.exports = JSONWriter;
