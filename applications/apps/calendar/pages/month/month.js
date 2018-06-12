var Q = require('q');
var Feature = require('sapphire-express').Feature;

module.exports = function(req, res, app)
{
	var month = new Feature(app, '/calendar/pages/month/');

	month.addPage({
		name: 'month',
		url: 'assets/pages/month.html',
		javascript: ['assets/js/Controllers/Month.js', 'assets/js/Views/Month.js'],
		css: ['assets/css/month.css']
	});

	return Q(app);
}
