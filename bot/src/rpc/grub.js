var Q = require('q');
var RpcHandler =  require('sapphire-rpc').RpcHandler;
var GrubModel = require('../models/GrubModel');
var registry = require('../bot/registry');

class RpcGrub extends RpcHandler {
	constructor ()
	{
		super('grub', SERVER);
		this.grubModel = new GrubModel();
	}

	save (channel, data)
	{
		if (channel !== 'grub') return Q(false);

		return this.grubModel.upsert(data)
			.then(function(response)
			{
				registry.update();
				return response;
			}.bind(this));
	}

	get (channel, data)
	{
		var date = data.date;
		var pod = data.pod;
		return this.grubModel.get(date, pod)
			.then(function(grub)
			{
				return grub;
			}.bind(this));
	}

	getMonth (channel, data)
	{
		var date = data.date;
		var pod = data.pod;
		return this.grubModel.getMonth(date, pod)
			.then(function(grub)
			{
				return grub;
			}.bind(this));
	}
}

var grub = new RpcGrub();
