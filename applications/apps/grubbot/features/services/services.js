var Q = require('q');
var Feature = require('sapphire-express').Feature;
var votingTemplate = require('./templates/voting');
var votedTemplate = require('./templates/voted');
var closedTemplate = require('./templates/closed');

module.exports = function(req, res, app)
{
	var services = new Feature(app, '/grubbot/features/services/');

	services.addJS(['assets/js/Services/Bootstrap.js', 'assets/js/Services/Renderer.js', 'assets/js/Services/Navigation.js']);
	services.addTemplates('templates/survey.html');
	services.addVariable('votingTemplate', votingTemplate);
	services.addVariable('votedTemplate', votedTemplate);
	services.addVariable('closedTemplate', closedTemplate);

	return Q(app);
}
