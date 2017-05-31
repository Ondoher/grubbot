var Q = require('q');
var RpcHandler =  require('sapphire-rpc').RpcHandler;
var VoteModel = require('../models/VoteModel');
var uuid = require('node-uuid');

class RpcVote extends RpcHandler {
	constructor ()
	{
		super('vote', SERVER);
	}

	get (channel, data)
	{
		if (channel !== 'vote') return Q(false);

		var votesModel = new VoteModel();
		return votesModel.get(data.meal, data.user);
	}

	vote (channel, data)
	{
		console.log('voting', channel, data)
		if (channel !== 'vote') return Q(false);

		var votesModel = new VoteModel();
		return votesModel.vote (data.meal, data.user, data.value);
	}

	result (channel, data)
	{
		if (channel !== 'vote') return Q(false);

		var votesModel = new VoteModel();
		return votesModel.getResult(data.meal)
	}

	resultMonth (channel, data)
	{
		if (channel !== 'vote') return Q(false);

		var votesModel = new VoteModel();
		return votesModel.getResultMonth(data.date, data.pod)
	}

	count (channel, data)
	{
		if (channel !== 'vote') return Q(false);

		var votesModel = new VoteModel();
		return votesModel.count (data.meal)
	}
}

var vote = new RpcVote();
