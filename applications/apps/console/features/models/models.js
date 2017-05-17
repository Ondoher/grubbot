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
	models.addUrl('getGrub', '/console/services/grub/get');
	models.addUrl('updateGrub', '/console/services/grub/update');
	models.addUrl('saveMenu', '/console/services/grub/saveMenu');

	return Q(app);
}
