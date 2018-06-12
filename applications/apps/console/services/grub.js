var Q = require('q');
var Service = require('sapphire-express').Service;
var uuid = require('node-uuid');
var path = require('path');
var btoa = require('btoa');
var static = require('node-static');

var directory = CONFIG.console.menuFiles;
if (directory.indexOf(':') !==-1) directory = directory.split(':')[1];
directory = directory.split('\\').join('/');
var file = new(static.Server)(directory);


GrubService = new Class({
	Implements : [Service],

	initialize : function()
	{
		this.export('create', module);
		this.export('get', module);
		this.export('getRange', module);
		this.export('update', module);
		this.export('updateMenu', module);
		this.export('downloadMenu', module);

		this.addCSRFException('create');
		this.addCSRFException('updateMenu');
		this.addCSRFException('downloadMenu');
	},

	verify : function(req, res)
	{
		return true;
	},

	getLunch : function(date, filname)
	{
		return {
			type: 'Lunch',
			id: btoa(uuid.v4()),
			menu: filname,
			notification: date + 9 * 60 * 60 * 1000,
			start: date + 13 * 60 * 60 * 1000,
			end: date + 17 * 60 * 60 * 1000,
		};
	},

	getDinner : function(date, filname)
	{
		return {
			type: 'Dinner',
			id: btoa(uuid.v4()),
			menu: filname,
			notification: date + 15 * 60 * 60 * 1000,
			start: date + 18 * 60 * 60 * 1000,
			end: date + 23 * 60 * 60 * 1000,
		};
	},

	create : function(req, res)
	{
		var ts = parseInt(req.body.date, 10);
		var pod = req.body.pod;

        console.log('create, req.body', req.body);

		var index = parseInt(req.body.index, 10);
		var meal = req.body.meal ? JSON.parse(req.body.meal) : false;
		var menu = req.files && req.files.menu;

		return SERVER.ask('grub', 'grub', 'get', {date: ts, pod: pod})
			.then(function(grub)
			{
				grub = grub || {
					date: ts,
					pod: pod,
					meals: []
				};

				if (meal)
				{
					meal.id = btoa(uuid.v4()),
					grub.meals.push(meal);
				}

				if (meal && menu)
				{
					var index = grub.meals.length - 1;
					var name = btoa(uuid.v4()) + '.pdf';
					var filename = path.join(CONFIG.console.menuFiles, name);
					menu.mv(filename);
					grub.meals[index].menu = name;
				}

				return SERVER.ask('grub', 'grub', 'save', grub)
					.then(function(grub)
					{
						return Q({success: true, result: grub});
					}.bind(this));
			}.bind(this));
	},

	updateMenu : function(req, res)
	{
		var menu = req.files && req.files.menu;
		var grub = JSON.parse(req.body.grub);
		var index = parseInt(req.body.index, 10);

		if (menu)
		{
			var name = btoa(uuid.v4()) + '.pdf';
			var filename = path.join(CONFIG.console.menuFiles, name);
			menu.mv(filename);
			grub.meals[index].menu = name;

			return SERVER.ask('grub', 'grub', 'save', grub)
				.then(function(grub)
				{
					return Q({success: true, result: grub});
				}.bind(this));
		}
		else
		{
			return Q({success: false, message: 'no menu specified'});
		}
	},

	get : function(req, res)
	{
		var ts = parseInt(req.body.date, 10);
		var pod = req.body.pod;

		return SERVER.ask('grub', 'grub', 'get', {date: ts, pod: pod})
			.then(function(grub)
			{
				return {success: true, result: grub};
			}.bind(this));

	},

	getRange : function(req, res)
	{
        console.log('getRange, req.body', req.body);
		var start = parseInt(req.body.start, 10);
		var stop = parseInt(req.body.stop, 10);
		var pod = req.body.pod;

		return SERVER.ask('grub', 'grub', 'getRange', {start: start, stop: stop, pod: pod})
			.then(function(grub)
			{
				return {success: true, result: grub};
			}.bind(this));
	},

	update : function(req, res)
	{
		var session = req.session.get();
		var grub = JSON.parse(req.body.grub);

		grub.meals.each(function(meal)
		{
			meal.id = meal.id || btoa(uuid.v4())
		},this);

		return SERVER.ask('grub', 'grub', 'save', grub)
			.then(function(grub)
			{
				return {success: true, result: grub};
			}.bind(this));
	},

	downloadMenu :  function(req, res)
	{
		var deferred = Q.defer();
		var name = req.query.name;

		file.serveFile(name, 200, {}, req, res).on('end', function()
		{
			deferred.resolve(null);
		}.bind(this)).on('error', function(e)
		{
			deferred.reject(e);
		}.bind(this));

		return deferred.promise;

	}

});

new GrubService();
