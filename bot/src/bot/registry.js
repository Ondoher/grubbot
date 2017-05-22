var Q = require('q');
var config = require('../config');
var GrubModel = require('../models/GrubModel');
var symphonyApi = require('symphony-api');

class BotRegistry {
	constructor ()
	{
		this.bots = [];
		this.grubModel = new GrubModel();
		this.interval = setInterval(this.tick.bind(this), 60 * 1000);
		this.running = [];
	}

	authOne(bot)
	{
		var urls = {
			keyUrl: bot.keyUrl,
			sessionUrl: bot.sessionUrl ,
			agentUrl: bot.agentUrl,
			podUrl: bot.podUrl,
		}

		var api = symphonyApi.create(urls);
		api.setCerts(bot.auth.cert, bot.auth.key, bot.auth.passphrase);
		api.setLogState(true);
		bot.api = api;
		return api.authenticate()
	}

	auth ()
	{
		var promises = [];
		Object.each(config.bots, function(bot)
		{
			promises.push(this.authOne(bot));
		}, this);

		return Q.all(promises);
	}

	run ()
	{
		var date = new Date();
		date.setHours(0, 0, 0, 0);

		console.log('run');
		return this.grubModel.getAll(date)
			.then(function(bots)
			{
				console.log('all bots', bots);
				this.running = bots;
			}.bind(this));
	}

	start ()
	{
		return this.auth()
			.then(this.run.bind(this))
	}

	update ()
	{
		return this.run();
	}

	tick ()
	{
		this.running.each(function(bot)
		{
			console.log(bot);
		}, this);
	}

	send (pod, message, data)
	{
		var api = config.bots[pod].api;

		if (!api) return;

		return api.message.v3.send(config.bots[pod].threadid, message, data);
	}
}

module.exports = new BotRegistry();
