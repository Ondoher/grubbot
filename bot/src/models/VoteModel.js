var Q = require('q');
var DB = require('./db');
var MongoModel = require('./MongoModel');
var ObjectID = require('mongodb').ObjectID;
var GrubModel = require('./GrubModel');

class VoteModel extends MongoModel {
	constructor ()
	{
		super();
	}

	count (meal)
	{
		return this.getCollection('vote')
			.then(this.count.bind(this, {meal: meal}))
	}

	get (meal, user)
	{
		return this.getCollection('vote')
			.then(this.find.bind(this, {meal: meal, user: user}))
			.then(function(result)
			{
				if (!result || result.length !== 1) return false;
				return result[0];
			}.bind(this));
	}

	upsert (vote)
	{
		if (vote._id && typeof vote._id !== 'object') vote._id = new ObjectID.createFromHexString(vote._id);

		return this.getCollection('vote')
			.then(function(collection)
			{
				return collection.save(vote)
					.then(function(result)
					{
						if (result.writeError) return Q.reject(new Error(result.writeError.errmsg));
						return this.get(vote.meal, vote.user)
							.then(function(vote)
							{
								if (vote) return vote;
								return Q.reject(new Error('error saving vote, no vote found'));
							}.bind(this))
					}.bind(this));
			}.bind(this))
	}

	vote (meal, user, value)
	{
		return this.get(meal, user)
			.then(function(vote)
			{
				if (vote) return false;
				vote = {
					meal: meal,
					user: user,
					value: value
				}
				return this.upsert(vote);

			}.bind(this));
	}

	getAll (meal)
	{
		return this.getCollection('vote')
			.then(this.find.bind(this, {'meal': meal}))
	}

	getAllFrom (meals)
	{
		return this.getCollection('vote')
			.then(this.find.bind(this, {'meal': {$in: meals}}))
	}

	getResult (meal)
	{
		return this.getAll(meal)
			.then(function(meals)
			{
				if (!meals || meals.length === 0) return false;

				var sum = meals.reduce(function(acc, meal)
				{
					return acc + meal.value;
				}.bind(this), 0);

				return {
					total: sum,
					count: meals.length,
					average: sum / meals.length,
				}
			}.bind(this), 0)
	}

	getMeals (days)
	{
		var meals = [];
		days.each(function(day)
		{
			day.meals.each(function(meal)
			{
				meals.push(meal.id);
			}, this);
		}, this);

		return Q(meals);
	}

	summarize (votes)
	{
		var totals = {};

		votes.each(function(vote)
		{
			totals[vote.meal] = totals[vote.meal] || {sum: 0, count: 0};
			totals[vote.meal].sum += vote.value;
			totals[vote.meal].count++;
		}, this);

		Object.each(totals, function(total)
		{
			total.average = total.sum / total.count;
		}, this);

		return Q(totals);
	}

	getResultMonth (date, pod)
	{
		this.grubModel = new GrubModel();
		return this.grubModel.getMonth(date, pod)
			.then(this.getMeals.bind(this))
			.then(this.getAllFrom.bind(this))
			.then(this.summarize.bind(this));
	}

}

module.exports = VoteModel;

