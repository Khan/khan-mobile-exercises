
var path = require("path");

module.exports = {
	entry: "./prototype-core/src/index.js",
	output: {
		path: __dirname + "/prototype-core/public/scripts",
		filename: "build.js",
	},

  module: {
    loaders: [{
      test: /\.json$/,
      loader: 'json',
    }, {
      test: /\.js$/,
      loader: 'babel',
    }],
  },

	devtool: "eval-source-map",

}
