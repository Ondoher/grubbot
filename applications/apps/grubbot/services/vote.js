var Q = require('q');
var Service = require('sapphire-express').Service;
var uuid = require('node-uuid');
var path = require('path');
var btoa = require('btoa');

VoteService = new Class({
	Implements : [Service],

	initialize : function()
	{
		this.export('get', module);
		this.export('vote', module);
		this.export('count', module);
		this.export('result', module);
		this.export('resultMonth', module);
	},

	verify : function(req, res)
	{
		return true;
	},

	get : function(req, res)
	{
		var meal = req.body.meal;
		var user = req.body.user;

		return SERVER.ask('vote', 'vote', 'get', {meal: meal, user: user})
			.then(function(vote)
			{
				return {success: true, result: vote};
			}.bind(this));
	},

	vote : function(req, res)
	{
		var meal = req.body.meal;
		var user = req.body.user;
		var value = parseInt(req.body.value, 10);

		return SERVER.ask('vote', 'vote', 'vote', {meal: meal, user: user, value: value})
			.then(function(vote)
			{
				return {success: true, result: vote};
			}.bind(this));
	},

	count : function(req, res)
	{
		var meal = req.body.meal;

		return SERVER.ask('vote', 'vote', 'count', {meal: meal})
			.then(function(vote)
			{
				return {success: true, result: vote};
			}.bind(this));
	},

	result : function(req, res)
	{
		var meal = req.body.meal;

		return SERVER.ask('vote', 'vote', 'result', {meal: meal})
			.then(function(vote)
			{
				return {success: true, result: vote};
			}.bind(this));
	},

	resultMonth : function(req, res)
	{
		var date = req.body.date;
		var pod = req.body.pod;

		return SERVER.ask('vote', 'vote', 'resultMonth', {date: parseInt(date, 10), pod: pod})
			.then(function(vote)
			{
				return {success: true, result: vote};
			}.bind(this));
	},
});

new VoteService();
