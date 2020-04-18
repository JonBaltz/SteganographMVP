const path = require('path');

module.exports = {
    entry: path.join(__dirname, '/client/src/index.js'),
    output: {
        path: path.resolve(__dirname, 'client/dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
              test: /\.(js|jsx)$/,
                exclude: '/node-modules/',
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    }
};