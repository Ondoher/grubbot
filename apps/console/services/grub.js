var Q = require('q');
var Service = require('sapphire-express').Service;
var uuid = require('node-uuid');

GrubService = new Class({
	Implements : [Service],

	initialize : function()
	{
		this.export('create', module);
	},

	verify : function(req, res)
	{
		return true;
	},

	create : function(req, res)
	{
		var session = req.session.get();
		var id = req.body.botId;

		console.log(req.files);
	},

	uploadMenu : function(req, res)
	{
		var session = req.session.get();
		var id = req.body.botId;

		console.log(req.files);
	},

});

new BotService();
