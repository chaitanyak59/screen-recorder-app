var path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
     entry: {
        main: './src/main.ts',
        renderer: './src/renderer.ts'
     },
     resolve: { extensions: ['.js', '.jsx', '.tsx', '.ts', '.json'] },
     output: {
         path: path.resolve(__dirname, 'build'),
         filename: '[name].bundle.js'
     },
     module: {
         rules: [
             {
                 test: /\.ts$/,
                 loader: 'babel-loader',
                 exclude: /node_modules/
             }
         ]
     },
     plugins: [
        new CopyPlugin([
          { from: './src/view', to: 'view' },
          { from: './package.json', to: '' },
        ]),
    ],
     stats: {
         colors: true
     },
     mode: 'production',
     watch: false,
     target: 'electron-main'
 };