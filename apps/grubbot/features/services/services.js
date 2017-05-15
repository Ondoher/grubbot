var Q = require('q');
var Feature = require('sapphire-express').Feature;

module.exports = function(req, res, app)
{
	var services = new Feature(app, '/grubbot/features/services/');

	services.addJS(['assets/js/Services/Bootstrap.js', 'assets/js/Services/Renderer.js']);
	services.addTemplates('templates/survey.html');

	return Q(app);
}
