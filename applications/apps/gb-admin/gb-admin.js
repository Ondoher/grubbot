var Q = require('q');
var sapphire = require('sapphire-express');

function main(req, res, app)
{
	app.addJS([
		'https://www.symphony.com/resources/api/v1.0/symphony-api.js',
	], true);

	app.addCSS([
		'/gb-admin/assets/css/gb-admin.css',
	]);

	app.addJS([
		'/assets/js/lib/translate.js',
		'/assets/js/lib/templates.js',
		'/gb-admin/assets/js/Views/GbAdmin.js',
		'/gb-admin/assets/js/Controllers/GbAdmin.js',
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
	var app = new sapphire.Application('GB_ADMIN', req, res);

	app.setTitle('GbAdmin');
	app.setBody('apps/gb-admin/templates/body.html');
	app.setMaster('apps/gb-admin/templates/master.html');
	app.addVariable('baseUrl', CONFIG.baseUrl);
	app.addVariable('appId', CONFIG['gb-admin'].appId);

	return main(req, res, app)
		.then(sapphire.features.animator.bind(sapphire.features.animator, req, res))
		.then(sapphire.features.dialogs.bind(sapphire.features.dialogs, req, res))
		.then(use('features', 'services', req, res))
		.then(function(app)
		{
			return Q(app);
		})
}
