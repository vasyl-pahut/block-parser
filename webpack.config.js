module.exports = {
  entry: './src/index',

  output: {
    filename: 'bundle.js'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        query: {
          presets:['stage-0']
        }
      }
    ]
  }
}