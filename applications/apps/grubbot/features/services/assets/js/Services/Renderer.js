Package('Grubbot.Services', {
	Renderer : new Class({
		implements : ['render', 'action'],

		initialize : function()
		{
			this.serviceName = 'grubbot:renderer';
			this.importServices = 'entity'.split(',');

			this.voteModel = SAPPHIRE.application.getModel('vote');
			SYMPHONY.services.make(this.serviceName, this, this.implements, true);

			SAPPHIRE.application.listen('start', this.onStart.bind(this));
			GRUBBOT.events.listen('start', this.onReady.bind(this));
		},

		action: function(data)
		{
			console.log('action', data);
			this.voteModel.vote(data.entity.id, GRUBBOT.userId, data.vote)
				.then(function(response)
				{
					console.log('voted', response);
				}.bind(this));
		},

		renderVoting : function(entityData)
		{
			var instanceId = String.uniqueID();
			var result = {
				template: this.votingXml,
				data: {
					venue: entityData.venue,
					end: new Date(entityData.end).format('%T'),
					onestar: {
						icon: GRUBBOT.baseUrl + '/grubbot/assets/images/star.png',
						label: '',
						service: this.serviceName,
						data : {
							cmd: 'vote',
							vote: 1,
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

				entityInstanceId : instanceId,
			};

			return result;
		},

		render : function(type, entityData)
		{
			console.log('render', entityData);
			return this.renderVoting(entityData);
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

			this.entity = SYMPHONY.services.subscribe('entity');
			this.entity.registerRenderer('com.symphony.grubbot.feedback', {}, this.serviceName);
		}
	})
});

new Grubbot.Services.Renderer();
