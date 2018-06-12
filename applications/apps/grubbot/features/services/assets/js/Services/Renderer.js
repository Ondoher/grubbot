Package('Grubbot.Services', {
	Renderer : new Class({
        implements : ['render', 'action', 'reaped'],

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

		track : function(entity)
		{
			this.tracked[entity.instanceId] = entity;
		},

		untrack : function(instanceId)
		{
			delete this.tracked[instanceId];
		},

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

		renderClosed : function(entityData, voteData)
		{
			var average = voteData.result.average;
			var stars = this.getStars(average);
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

		renderVoted : function(entityData, voteData)
		{
			var average = voteData.result.average;
			var stars = this.getStars(average);
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

		render : function(type, entityData)
		{
			var instanceId = String.uniqueID();
			return this.getVoteData(entityData)
				.then(function(response)
				{
					var result;

					if (entityData.end < Date.now()) result = this.renderClosed(entityData, response);
					else if (!response.vote) result = this.renderVoting(entityData, instanceId);
					else result = this.renderVoted(entityData, response);

					result.entityInstanceId = instanceId;

					if (entityData.end < Date.now() &&  response)
						setTimeout(function()
						{
							this.track({instanceId: instanceId, entityData: entityData});
                        }.bind(this), 500);

					return result;
				}.bind(this));
		},


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

					return this.entity.update(tracked.instanceId, result.template, result.data);
				}.bind(this));
		},

        reaped : function(what, type, id, messageId) {
            this.untrack(id);
        },

		onStart : function(done)
		{
			var bootstrap = SYMPHONY.services.subscribe('bootstrap');

			this.importServices.each(function(service)
			{
				bootstrap.importService(service);
			}, this);

			bootstrap.exportService(this.serviceName);
			done();
		},

		onReady : function()
		{
			this.votingXml = GRUBBOT.votingTemplate;
			this.votedXml = GRUBBOT.votedTemplate;
			this.closedXml = GRUBBOT.closedTemplate;

			this.entity = SYMPHONY.services.subscribe('entity');
			this.entity.registerRenderer('com.symphony.grubbot.feedback', {}, this.serviceName);
			this.interval = setInterval(this.tick.bind(this), 5 * 60 * 1000);
		}
	})
});

new Grubbot.Services.Renderer();
