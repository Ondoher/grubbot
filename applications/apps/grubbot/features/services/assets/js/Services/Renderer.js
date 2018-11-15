Package('Grubbot.Services', {
	Renderer : new Class({
		implements : ['render', 'action', 'reaped'],

	// class constructor
		initialize : function()
		{
			this.serviceName = 'grubbot:renderer';
			this.importServices = 'entity'.split(',');

			this.tracked = {};

			this.voteModel = SAPPHIRE.application.getModel('vote');
			SYMPHONY.services.make(this.serviceName, this, this.implements, true);

			SAPPHIRE.application.listen('start', this.onStart.bind(this));
			GRUBBOT.events.listen('start', this.onReady.bind(this));
		},

	// called to track an entity that can be updated
		track : function(entity)
		{
			this.tracked[entity.instanceId] = entity;
		},

	// called to untrack an entity that will no longer be updated
		untrack : function(instanceId)
		{
			delete this.tracked[instanceId];
		},

	// on the timer, update all tracked entities
		tick : function()
		{
			Object.each(this.tracked, function(entity)
			{
				this.rerender(entity);
			}, this);
		},

		getVote : function(entityData)
		{
			return this.voteModel.get(entityData.id);
		},

		getResults : function(entityData, vote)
		{
			return this.voteModel.result(entityData.id)
				.then(function(result)
				{
					return {
						vote: vote,
						result: result,
					}
				}.bind(this));
		},

		getVoteData : function(entityData)
		{
			return this.getVote(entityData)
				.then(this.getResults.bind(this, entityData))
		},

	// called in response to a star being clicked
		action: function(data)
		{
			this.voteModel.vote(data.entity.id, GRUBBOT.userId, data.vote)
				.then(function(response)
				{
					var track = {instanceId: data.instanceId, entityData: data.entity};
					this.track(track);
					this.rerender(track);
				}.bind(this));
		},

		renderVoting : function(entityData, instanceId)
		{
		// template is the extentionML template, data is values for the template.
		// The keys of this object correspond to the id attribute on template tags

		// the stars on the voting state are implemented as actions. The data field is
		// passed to the action method of the specified service
			var result = {
				template: this.votingXml,
				data: {
					card: {icon: GRUBBOT.baseUrl + '/grubbot/assets/images/grubbot.svg', accent: 'tempo-bg-color--green'},
					icon: GRUBBOT.baseUrl + '/grubbot/assets/images/grubbot.svg',
					accent: 'tempo-bg-color--green',
					type: entityData.mealType.toLowerCase(),
					venue: entityData.venue,
					end: new Date(entityData.end).format('%l:%M %p'),
					onestar: {
						icon: GRUBBOT.baseUrl + '/grubbot/assets/images/star.png',
						label: '',
						service: this.serviceName,
						data : {
							cmd: 'vote',
							vote: 1,
							entity: entityData,
							instanceId: instanceId,
						}
					},
					twostars: {
						icon: GRUBBOT.baseUrl + '/grubbot/assets/images/star.png',
						label: '',
						service: this.serviceName,
						data : {
							cmd: 'vote',
							vote: 2,
							entity: entityData,
							instanceId: instanceId,
						}
					},
					threestars: {
						icon: GRUBBOT.baseUrl + '/grubbot/assets/images/star.png',
						label: '',
						service: this.serviceName,
						data : {
							cmd: 'vote',
							vote: 3,
							entity: entityData,
							instanceId: instanceId,
						}
					},
					fourstars: {
						icon: GRUBBOT.baseUrl + '/grubbot/assets/images/star.png',
						label: '',
						service: this.serviceName,
						data : {
							cmd: 'vote',
							vote: 4,
							entity: entityData,
							instanceId: instanceId,
						}
					},
					fivestars: {
						icon: GRUBBOT.baseUrl + '/grubbot/assets/images/star.png',
						label: '',
						service: this.serviceName,
						data : {
							cmd: 'vote',
							vote: 5,
							entity: entityData,
							instanceId: instanceId,
						}
					},
				},
			};

			return result;
		},

		getStar : function(part)
		{
			part = Math.max(part, 0);
			var emptyStar = GRUBBOT.baseUrl + '/grubbot/assets/images/star.png';
			var halfStar = GRUBBOT.baseUrl + '/grubbot/assets/images/half-star.png';
			var fullStar = GRUBBOT.baseUrl + '/grubbot/assets/images/full-star.png';

			if (part === 0) return '<img src="' + emptyStar + '" />';
			if (part <= 0.5) return '<img src="' + halfStar + '" />';
			else return '<img src="' + fullStar + '" />';
		},

		getStars : function(average)
		{
			average = Math.round(average * 2) / 2;
			var stars = '';

			stars += this.getStar(average);
			stars += this.getStar(average - 1);
			stars += this.getStar(average - 2);
			stars += this.getStar(average - 3);
			stars += this.getStar(average - 4);

			return stars;
		},

	// render the entity state after voting has closed
		renderClosed : function(entityData, voteData)
		{
			var average = voteData.result.average;
			var stars = this.getStars(average);

		// template is the extentionML template, data is values for the template.
		// The keys of this object correspond to the id attribute on template tags
			var result = {
				template: this.closedXml,
				data: {
					type: entityData.mealType.toLowerCase(),
					venue: entityData.venue,
					card: {icon: GRUBBOT.baseUrl + '/grubbot/assets/images/grubbot.svg', accent: 'tempo-bg-color--green'},
					icon: GRUBBOT.baseUrl + '/grubbot/assets/images/grubbot.svg',
					accent: 'tempo-bg-color--green',
					stars: stars,
					rating: Math.round(average * 100) / 100,
				},
			};

			return result;
		},

	// render the entity state after the user has voted but before voting has closed
		renderVoted : function(entityData, voteData)
		{
			var average = voteData.result.average;
			var stars = this.getStars(average);

		// template is the extentionML template, data is values for the template.
		// The keys of this object correspond to the id attribute on template tags
			var result = {

				template: this.votedXml,
				data: {
					card: {icon: GRUBBOT.baseUrl + '/grubbot/assets/images/grubbot.svg', accent: 'tempo-bg-color--green'},
					icon: GRUBBOT.baseUrl + '/grubbot/assets/images/grubbot.svg',
					accent: 'tempo-bg-color--green',
					stars: stars,
					rating: Math.round(average * 100) / 100,
				},
			};

			return result;
		},

	// the entity renderer for Grubbot.
		render : function(type, entityData)
		{
		// create a unique instance string so we can update the rendered entity
			var instanceId = String.uniqueID();

		// get the latest voting data
			return this.getVoteData(entityData)
				.then(function(response)
				{
					var result;

				// render the entity state
					if (entityData.end < Date.now()) result = this.renderClosed(entityData, response);
					else if (!response.vote) result = this.renderVoting(entityData, instanceId);
					else result = this.renderVoted(entityData, response);

				// return the instance ID as part of the result so that Symphony can track
				// the rendered entity for later updating
					result.entityInstanceId = instanceId;

				// If the voting has not closed, track the new entity
					if (entityData.end < Date.now() &&  response)
						setTimeout(function()
						{
							this.track({instanceId: instanceId, entityData: entityData});
						}.bind(this), 500);

					return result;
				}.bind(this));
		},

	// Called by the update timer to rerender an entity with the latest voting data
		rerender : function(tracked)
		{
			var entityData = tracked.entityData;

			return this.getVoteData(entityData)
				.then(function(response)
				{
					var result;

					if (entityData.end < Date.now()) result = this.renderClosed(entityData, response);
					else if (!response.vote) result = this.renderVoting(entityData);
					else result = this.renderVoted(entityData, response);

					if (entityData.end < Date.now()) this.untrack(tracked.instanceId);

				// update the entity with new rendering data. Uses the instance id created when the
				// entity was first rendered
					return this.entity.update(tracked.instanceId, result.template, result.data);
				}.bind(this));
		},

	// after voting has closed, stop tracking the entity for updating
		reaped : function(what, type, id, messageId) {
			this.untrack(id);
		},

	// This method is called by the Sapphire framework when the DOM is fully loaded
	// but before the application is registered with the Symphony client
		onStart : function(done)
		{
			var bootstrap = SYMPHONY.services.subscribe('bootstrap');

		// specify the required Symphony services
			this.importServices.each(function(service)
			{
				bootstrap.importService(service);
			}, this);

		// export our service so it can be imported by the Symphony client
			bootstrap.exportService(this.serviceName);
			done();
		},

	// This method is called after the application has been registered with the
	// Symphony client. All required services have been imported and are available.
		onReady : function()
		{
		// get or templates
			this.votingXml = GRUBBOT.votingTemplate;
			this.votedXml = GRUBBOT.votedTemplate;
			this.closedXml = GRUBBOT.closedTemplate;

		// register our entity renderer
			this.entity = SYMPHONY.services.subscribe('entity');
			this.entity.registerRenderer('com.symphony.grubbot.feedback', {}, this.serviceName);

		// set up timer to update rendered entities with voting results
			this.interval = setInterval(this.tick.bind(this), 5 * 60 * 1000);
		}
	})
});

new Grubbot.Services.Renderer();
