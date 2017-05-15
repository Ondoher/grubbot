Package('Grubbot.Services', {
	Renderer : new Class({
		implements : ['render', 'action'],

		initialize : function()
		{
			this.serviceName = 'grubbot:renderer';
			this.importServices = 'entity'.split(',');

			SYMPHONY.services.make(this.serviceName, this, this.implements, true);

			SAPPHIRE.application.listen('start', this.onStart.bind(this));
			GRUBBOT.events.listen('start', this.onReady.bind(this));
		},

		action: function()
		{
			console.log('action', arguments);
		},

		render : function(type, entityData)
		{
			var result = {
				template: this.surveyXml,
				data: {
					onestar: {
						icon: GRUBBOT.baseUrl + '/grubbot/assets/images/star.png',
						label: '',
						service: this.serviceName,
						data : {
							vote: 1
						}
					},
					twostars: {
						icon: GRUBBOT.baseUrl + '/grubbot/assets/images/star.png',
						label: '',
						service: this.serviceName,
						data : {
							vote: 2
						}
					},
					threestars: {
						icon: GRUBBOT.baseUrl + '/grubbot/assets/images/star.png',
						label: '',
						service: this.serviceName,
						data : {
							vote: 3
						}
					},
					fourstars: {
						icon: GRUBBOT.baseUrl + '/grubbot/assets/images/star.png',
						label: '',
						service: this.serviceName,
						data : {
							vote: 4
						}
					},
					fivestars: {
						icon: GRUBBOT.baseUrl + '/grubbot/assets/images/star.png',
						label: '',
						service: this.serviceName,
						data : {
							vote: 5
						}
					},
				}
			};

			return result;
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
			this.surveyTemplate = SAPPHIRE.templates.get('survey-template');
			this.surveyXml = new XMLSerializer().serializeToString(this.surveyTemplate[0]);

			this.entity = SYMPHONY.services.subscribe('entity');
			this.entity.registerRenderer('com.symphony.grubbot.survey', {}, this.serviceName);
		}
	})
});

new Grubbot.Services.Renderer();
