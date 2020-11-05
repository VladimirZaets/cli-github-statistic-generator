const fs = require('fs');
const cachePath = './cache'

class CacheManager {
    isExist (key) {
        return fs.existsSync(`${cachePath}/${key}.json`);
    }
    
    async get (key) {
        return JSON.parse(fs.readFileSync(`${cachePath}/${key}.json`));
    }
    
    set (key, data) {
        fs.writeFile(`${cachePath}/${key}.json`, JSON.stringify(data), function (err) {
            if (err) return console.log(err);
        });
    }
}

module.exports = CacheManager;
