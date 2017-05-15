var Q = require('q');
var Feature = require('sapphire-express').Feature;

module.exports = function(req, res, app)
{
	var console = new Feature(app, '/gb-admin/pages/console/');

	console.addPage({
		name: 'console',
		url: 'assets/pages/console.html',
		javascript: ['assets/js/Controllers/Console.js', 'assets/js/Views/Console.js'],
		css: ['assets/css/console.css']
	});

	return Q(app);
}
