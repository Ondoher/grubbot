var Q = require('q');
var sapphire = require('sapphire-express');

function main(req, res, app)
{
	app.addJS([
		'https://www.symphony.com/resources/api/v1.0/symphony-api.js',
	], true);

	app.addCSS([
		'https://symphony.com/resources/api/v2.0/styles/symphony-external-app.css',
	], true);

	app.addCSS([
		'/calendar/assets/css/calendar.css',
	]);

	app.addJS([
		'/assets/js/lib/translate.js',
		'/assets/js/lib/templates.js',
		'/calendar/assets/js/Views/Calendar.js',
		'/calendar/assets/js/Controllers/Calendar.js',
	]);


	return Q(app)
}

function use(type, name, req, res)
{
	var module = require('./' + type + '/' + name + '/' + name + '.js');
	return function(app)
	{
		return module(req, res, app);
	}
}

exports.getApplication = function(req, res)
{
	var session = req.session.get();
	var app = new sapphire.Application('CALENDAR', req, res);

	app.setTitle('Calendar');
	app.setBody('apps//calendar/templates/body.html');
	app.setMaster('apps//calendar/templates/master.html');
	app.addVariable('baseUrl', CONFIG.baseUrl);
	app.addVariable('appId', CONFIG['grubbot'].appId);

	return main(req, res, app)
		.then(sapphire.features.animator.bind(sapphire.features.animator, req, res))
		.then(sapphire.features.dialogs.bind(sapphire.features.dialogs, req, res))
		.then(use('features', 'services', req, res))
		.then(use('features', 'main', req, res))
		.then(use('features', 'models', req, res))
		.then(use('pages', 'month', req, res))
		.then(function(app)
		{
			return Q(app);
		})
}

