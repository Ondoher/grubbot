var Q = require('q');
var DB = require('./db');
var MongoModel = require('./MongoModel');
var ObjectID = require('mongodb').ObjectID;

class GrubModel extends MongoModel {
	constructor ()
	{
		super();
	}

	get (date, pod)
	{
		var ts = date;
		return this.getCollection('grub')
			.then(this.find.bind(this, {'date': ts, pod: pod}))
			.then(function(result)
			{
				if (!result || result.length !== 1) return false;
				return result[0];
			}.bind(this));
	}

	getAll (start, stop)
	{
		console.log('getAll', start, stop)
		return this.getCollection('grub')
			.then(this.find.bind(this, {'date': {$gte: start, $lte: stop}}))
			.then(function(result)
			{
				return result;
			}.bind(this));
	}

	getRange (start, stop, pod)
	{
		return this.getCollection('grub')
			.then(this.find.bind(this, {'date': {$gte : start, $lte: stop}, pod: pod}))
			.then(function(result)
			{
				return result;
			}.bind(this));
	}

	upsert (grub)
	{
		if (grub._id && typeof grub._id !== 'object') grub._id = new ObjectID.createFromHexString(grub._id);
		return this.getCollection('grub')
			.then(function(collection)
			{
				return collection.save(grub)
					.then(function(result)
					{
						if (result.writeError) return Q.reject(new Error(result.writeError.errmsg));
						return this.get(grub.date, grub.pod)
							.then(function(grub)
							{
								if (grub) return grub;
								return Q.reject(new Error('error saving grub, no grub found'));
							}.bind(this))
					}.bind(this));
			}.bind(this))
	}
}

module.exports = GrubModel;

