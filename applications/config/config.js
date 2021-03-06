fs = require('fs');

var config = {
	port: 8081,
	useCompression: false,
	builderCache: false,
	minify : false,
	cors : {
	   origin: [/\.symphony\.com:.*$/, /\.symphony\.com$/]
	},
    middleware: 'middleware',
}

var env = process.env.node_env;

envConfig = {};
try
{
	if (env) envConfig = require('./config.' + env);
}
catch (e)
{
	console.log(e);
}

module.exports = Object.merge(config, envConfig);
