var Q = require('q');
var DB = require('./db');
var MongoModel = require('./MongoModel');
var ObjectID = require('mongodb').ObjectID;

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
				console.log('get result', result);
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
		console.log('voting...', meal, user, value)
		return this.get(meal, user)
			.then(function(vote)
			{
				if (vote) return false;
				vote = {
					meal: meal,
					user: user,
					value: value
				}
				console.log('vote', vote);
				return this.upsert(vote);

			}.bind(this));
	}

	getAll (meal)
	{
		return this.getCollection('vote')
			.then(this.find.bind(this, {'meal': meal}))
	}

	getResult (meal)
	{
		console.log('getResult', meal);
		return this.getAll(meal)
			.then(function(meals)
			{
				console.log('getResult then', meals);
				if (!meals || meals.length === 0) return false;

				var sum = meals.reduce(function(acc, meal)
				{
					console.log('reducing', acc, meal);
					return acc + meal.value;
				}.bind(this), 0);

				console.log('sum', sum);

				return {
					total: sum,
					count: meals.length,
					average: sum / meals.length,
				}
			}.bind(this), 0)
	}

}

module.exports = VoteModel;

