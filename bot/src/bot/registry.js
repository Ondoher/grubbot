var fs = require('fs');
var Q = require('q');
var config = require('../config');
var GrubModel = require('../models/GrubModel');
var symphonyApi = require('symphony-api');
var path = require('path');

class BotRegistry {
	constructor ()
	{
		this.grubModel = new GrubModel();
//		this.interval = setInterval(this.tick.bind(this), 60 * 1000);
		this.interval = setInterval(this.tick.bind(this), 10 * 1000);
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
				console.log('all bots', JSON.stringify(bots, null, '  '));
				this.running = bots;
			}.bind(this));
	}

	start ()
	{
		return this.auth()
			.then(this.run.bind(this))
	}

	sendNotification (pod, meal)
	{
		console.log('sendNotification', pod, meal)
		var api = config.bots[pod].api;
		var threadId = config.bots[pod].threadId;
		var attachment = {
			value: fs.createReadStream(path.join(config.menuFiles, meal.menu)),
			options: {
				filename: 'menu.pdf',
				contentType: 'application/pdf',
			}
		}
		var message = `
<messageML>
	Today's lunch will be from ${meal.venue}. <hash tag="gogrub"/>
</messageML>
`;
		api.message.v4.send(threadId, message, {}, attachment);
		return true;
	}

	sendStart (pod, meal)
	{
		return true;
	}

	sendEnd (pod, meal)
	{
		return true;
	}

	update ()
	{
		return this.run();
	}

	tick ()
	{
		var now = Date.now();

		this.running.each(function(bot)
		{
			var lastSent = bot.lastSent;
			var sent = false;
			if (!bot.lastSent) bot.lastSent = bot.date;

			bot.meals.each(function(meal)
			{
				if (bot.lastSent < meal.notification && meal.notification <= now) sent = this.sendNotification(bot.pod, meal);
				if (bot.lastSent < meal.start && meal.start <= now) sent = this.sendStart(bot.pod, meal);
				if (bot.lastSent < meal.end && meal.end <= now) sent = this.sendEnd(bot.pod, meal);

				if (sent)
				{
					bot.lastSent = now;
					console.log(JSON.stringify(bot, null, '  '));
					this.grubModel.upsert(bot)
				}
				//this.sendNotification(bot.pod, meal)
			}, this);

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
