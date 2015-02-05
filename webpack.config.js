module.exports = {
  entry: {
    game: './canvas.ts',
    form: './tank-upload-form/app.es6.js'
  },
  output: {
    path: './build',
    filename: '[name]-build.js'
  },
  resolve: {
    extensions: ['', '.js', '.es6.js', '.ts'],
  },
  module: {
    loaders: [
      {test: /\.ts$/, loader: '6to5-loader!ts-loader?sourceMap&target=ES6'},
      {test: /\.es6.js$/, loader: '6to5-loader'}
    ]
  }
};
