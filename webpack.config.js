const path = require('path');
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
	mode : "production",
	entry: './empty.js', // dummy instead of empty index.js
	output : {
		path: path.resolve(__dirname, 'public/reflector'),
		filename: 'dummy.js'
	},
	plugins: [
		// https://stackoverflow.com/questions/55420795/copy-files-from-node-modules-to-dist-dir
		new CopyWebpackPlugin({
			patterns: [{
				from: 'node_modules/@ipsme/reflector-ws-client/dist/reflector-bc-ws-client.js',
				to: 'reflector-bc-ws-client.js'
			}]
		})
	]
};
