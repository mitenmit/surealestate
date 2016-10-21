var webpack = require('webpack');

var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');
var minimize = process.argv.indexOf('--minimize') !== -1;


var plugins = [];

plugins.push(commonsPlugin);

if (minimize) plugins.push( new webpack.optimize.UglifyJsPlugin() );
 
  
module.exports = {
	//entry: './js/spa.js',
	
	entry: {
		app: './src/app.js',
		//home: './js/components/home/home.js',
		//about: './js/components/about/about.js'
	  },
		
	output: {
		path: './build', // This is where images AND js will go
		publicPath: 'build/', // This is used to generate URLs to e.g. images
		filename: '[name].js'
	},
	
	plugins: plugins,
	
	module: {
		loaders: [
			{ test: /\.css/, exclude: /node_modules/, loader: "style-loader!css-loader" },
			{ test: /\.gif/, exclude: /node_modules/, loader: "url-loader?limit=10000&minetype=image/gif" },
			{ test: /\.jpg/, exclude: /node_modules/, loader: "url-loader?limit=10000&minetype=image/jpg" },
			{ test: /\.png/, exclude: /node_modules/, loader: "url-loader?limit=10000&minetype=image/png" },
			{ test: /\.js$/, exclude: /node_modules/, loader: "babel-loader", query: {presets:['es2015', 'react']} }
		],	
	}
};