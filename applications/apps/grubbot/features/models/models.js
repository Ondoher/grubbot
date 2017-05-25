var Q = require('q');
var Feature = require('sapphire-express').Feature;

module.exports = function(req, res, app)
{
	var models = new Feature(app, '/grubbot/features/models/');

	models.addJS([
		'/assets/js/lib/ajax-service.js',
		'assets/js/Models/Service.js',
		'assets/js/Models/Vote.js',
	]);

	models.addUrl('getVote', '/grubbot/services/vote/get');
	models.addUrl('countVote', '/grubbot/services/vote/count');
	models.addUrl('vote', '/grubbot/services/vote/vote');
	models.addUrl('getVoteResult', '/grubbot/services/vote/result');

	return Q(app);
}
