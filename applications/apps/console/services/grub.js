var Q = require('q');
var Service = require('sapphire-express').Service;
var uuid = require('node-uuid');

GrubService = new Class({
	Implements : [Service],

	initialize : function()
	{
		this.export('create', module);

		this.addCSRFException('create');
	},

	verify : function(req, res)
	{
		return true;
	},

	create : function(req, res)
	{
		console.log('-------------------');
//		var session = req.session.get();
//		var id = req.body.botId;

		console.log('-------------------');
		console.log(req.body);
		console.log(req.files);
		return Q({success: true});

	},

	uploadMenu : function(req, res)
	{
		var session = req.session.get();
		var id = req.body.botId;

		console.log(req.files);
	},

});

new GrubService();
