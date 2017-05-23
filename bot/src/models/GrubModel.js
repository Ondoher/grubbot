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
		date = new Date(date);
		date.setHours(0, 0, 0, 0);
		var ts = date.getTime();
		return this.getCollection('grub')
			.then(this.find.bind(this, {'date': ts, pod: pod}))
			.then(function(result)
			{
				if (!result || result.length !== 1) return false;
				return result[0];
			}.bind(this));
	}

	getAll (date)
	{
		date = new Date(date);
		date.setHours(0, 0, 0, 0);
		var ts = date.getTime();
		return this.getCollection('grub')
			.then(this.find.bind(this, {'date': ts}))
			.then(function(result)
			{
				return result;
			}.bind(this));
	}

	upsert (grub)
	{
		console.log('upsert', typeof grub._id);
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

