module.exports = {
  entry: './canvas.ts',
  output: {
    path: './build',
    filename: 'build.js'
  },
  resolve: {
    extensions: ['', '.js', '.ts'],
  },
  module: {
    loaders: [
      {test: /\.ts$/, loader: '6to5-loader!ts-loader?sourceMap&target=ES6'}
    ]
  }
};
