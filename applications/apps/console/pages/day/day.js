var Q = require('q');
var Feature = require('sapphire-express').Feature;

module.exports = function(req, res, app)
{
	var day = new Feature(app, '/console/pages/day/');

	day.addPage({
		name: 'day',
		url: 'assets/pages/day.html',
		javascript: ['assets/js/Controllers/Day.js', 'assets/js/Views/Day.js'],
		css: ['assets/css/day.css']
	});

	return Q(app);
}
