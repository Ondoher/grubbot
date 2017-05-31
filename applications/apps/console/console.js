var Q = require('q');
var sapphire = require('sapphire-express');
require('./rpc');

function main(req, res, app)
{
	app.addJS([
		'https://www.symphony.com/resources/api/v1.0/symphony-api.js',
	], true);

	app.addCSS([
		'https://www.symphony.com/resources/api/v1.1/symphony-style.css',
//		'https://symphony.com/resources/api/v2.0/styles/symphony-external-app.css',
	], true);

	app.addCSS([
		'/console/assets/css/console.css',
//		'/console/assets/3rdParty/time-picker/css/bootstrap.css',
//		'/console/assets/3rdParty/time-picker/css/bootstrap-theme.min.css',
//		'/console/assets/3rdParty/time-picker/css/style.css',
		'/console/assets/3rdParty/time-picker/css/timepicki.css',
	]);

	app.addJS([
		'/assets/js/lib/translate.js',
		'/assets/js/lib/templates.js',
		'/console/assets/3rdParty/time-picker/js/bootstrap.min.js',
		'/console/assets/3rdParty/time-picker/js/timepicki.js',
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
	var app = new sapphire.Application('CONSOLE', req, res);

	app.setTitle('Console');
	app.setBody('apps//console/templates/body.html');
	app.setMaster('apps//console/templates/master.html');
	app.addVariable('baseUrl', CONFIG.baseUrl);
	app.addVariable('appId', CONFIG['gb-admin'].appId);

	return main(req, res, app)
		.then(sapphire.features.animator.bind(sapphire.features.animator, req, res))
		.then(sapphire.features.dialogs.bind(sapphire.features.dialogs, req, res))
		.then(use('features', 'models', req, res))
		.then(use('features', 'services', req, res))
		.then(use('features', 'main', req, res))
		.then(use('pages', 'month', req, res))
		.then(use('pages', 'day', req, res))
		.then(function(app)
		{
			return Q(app);
		})
}
