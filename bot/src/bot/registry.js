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

		this.date = date;

		return this.grubModel.getAll(date)
			.then(function(bots)
			{
				console.log('running', bots);
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
	Today's ${meal.type} will be from ${meal.venue}. <hash tag="grubon"/>
</messageML>
`;
		api.message.v4.send(threadId, message, {}, attachment);
		return true;
	}

	sendStart (pod, meal)
	{
		var api = config.bots[pod].api;
		var threadId = config.bots[pod].threadId;
		var attachment = {
			value: fs.createReadStream(path.join(config.menuFiles, meal.menu)),
			options: {
				filename: 'menu.pdf',
				contentType: 'application/pdf',
			}
		}
		var date = new Date(meal.start);
		date.setHours(0,0,0,0);

		var data = {
			vote: {
				type: 'com.symphony.grubbot.feedback',
				version: 1.0,
				id: meal.id,
				date: date.getTime(),
				start: meal.start,
				end: meal.end,
				venue: meal.venue,
				menu: meal.menu,
				mealType: meal.type,
			}
		};
		var message = `
<messageML>
	<hash tag="grubvote"/>
	<div class="entity" data-entity-id="vote">
		<span>Install the Grubbot application to provide feedback on the latest meal.</span>
	</div>
</messageML>
`;
		api.message.v4.send(threadId, message, data, attachment).done();
		return true;
	}

	sendEnd (pod, meal)
	{
		var api = config.bots[pod].api;
		var threadId = config.bots[pod].threadId;
		var date = new Date(meal.start);
		date.setHours(0,0,0,0);

		var attachment = {
			value: fs.createReadStream(path.join(config.menuFiles, meal.menu)),
			options: {
				filename: 'menu.pdf',
				contentType: 'application/pdf',
			}
		}

		var data = {
			vote: {
				type: 'com.symphony.grubbot.feedback',
				version: 1.0,
				id: meal.id,
				date: date.getTime(),
				start: meal.start,
				end: meal.end,
				venue: meal.venue,
				mealType: meal.type,
				menu: meal.menu,
			}
		};

		var message = `
<messageML>
	<hash tag="grubvote"/>
	<div class="entity" data-entity-id="vote">
		<span>Feedback period has ended. Install the Grubbot application to see results.</span>
	</div>
</messageML>
`;
		api.message.v4.send(threadId, message, data, attachment).done();
		return true;
	}

	update ()
	{
		return this.run();
	}

	tick ()
	{
		var now = Date.now();
		var date = new Date();
		date.setHours(0, 0, 0, 0);

		console.log(this.date, date);
		if (this.date.getTime() !== date.getTime()) return this.run();

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
					this.grubModel.upsert(bot)
				}

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
