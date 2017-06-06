var config = {
	defaultApp : 'gb-admin',
	useCompression: false,
	builderCache: false,
	minify : false,
	menuFiles: __dirname + '/../../../../menus',
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
