const path = require('path');

module.exports = {
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '~': path.resolve(__dirname, './')
    }
  },
};

