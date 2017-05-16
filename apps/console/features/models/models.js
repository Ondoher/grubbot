var Q = require('q');
var Feature = require('sapphire-express').Feature;

module.exports = function(req, res, app)
{
	var models = new Feature(app, '/console/features/models/');

	models.addJS([
		'/assets/js/lib/ajax-service.js',
		'assets/js/Models/Service.js',
		'assets/js/Models/Grub.js',
	]);

	models.addUrl('createGrub', '/console/services/grub/create');

	return Q(app);
}
