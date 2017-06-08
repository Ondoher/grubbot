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

		var date = new Date().getTime();

		this.date = date;
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

	run (start, stop)
	{
		console.log('run', start, stop)
		if (!start)
		{
			var date = new Date();
			date.setHours(date.getHours(), 0, 0, 0);
			stop = date.getTime();
			start = stop - (24 * 60 * 60 * 1000);

			console.log('---', start, stop, new Date(start), new Date(stop));
		}

		return this.grubModel.getAll(start, stop)
			.then(function(bots)
			{
				console.log('bots', JSON.stringify(bots, null, '  '));
				this.running = this.running.concat(bots);
				console.log('running', JSON.stringify(this.running, null, '  '));
				this.date = stop;
			}.bind(this));
	}

	ignore () {}

	start ()
	{
		return this.auth()
			.then(this.ignore.bind(this))
			.then(this.run.bind(this))
	}

	sendNotification (pod, meal, date)
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

	sendStart (pod, meal, date)
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
				date: date,
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

	sendEnd (pod, meal, date)
	{
		console.log('sendEnd', pod, meal, date);
		var api = config.bots[pod].api;
		var threadId = config.bots[pod].threadId;

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
				date: date,
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

// !Pending: remove if last meal has been sent
		return true;
	}

	update ()
	{
		this.running = [];
		return this.run();
	}

	tick ()
	{
		var now = Date.now();
		var date = new Date();
		date.setHours(date.getHours(), 0, 0, 0);

	// every hour get new days
		console.log('running...', this.date, date.getTime());
		if (this.date !== date.getTime()) return this.run(date.getTime(), date.getTime());

		this.running.each(function(bot)
		{
			var lastSent = bot.lastSent;
			var sent = false;
			if (!bot.lastSent) bot.lastSent = bot.date;

			bot.meals.each(function(meal)
			{
				if (bot.lastSent < meal.notification && meal.notification <= now) sent = this.sendNotification(bot.pod, meal, bot.date);
				if (bot.lastSent < meal.start && meal.start <= now) sent = this.sendStart(bot.pod, meal, bot.date);
				if (bot.lastSent < meal.end && meal.end <= now) sent = this.sendEnd(bot.pod, meal, bot.date);

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
