var config = {
	useCompression: false,
	builderCache: false,
	minify : false,
	cors : {
		origin: [/\.symphony\.com:.*$/, /\.symphony\.com$/]
	},
	middleware: 'middleware',

}

var env = process.env.node_env || 'dev';

envConfig = {};
try
{
	if (env) envConfig = require('./config.' + env);
}
catch (e)
{
}

module.exports = Object.merge(config, envConfig);
