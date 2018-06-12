var Q = require('q');
var Feature = require('sapphire-express').Feature;

module.exports = function(req, res, app)
{
	var main = new Feature(app, '/console/features/main/');

  	main.addJS(['assets/js/Controllers/Main.js', 'assets/js/Views/Main.js']);

	return Q(app);
}
