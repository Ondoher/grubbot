Package('Grubbot.Services', {
	Navigation : new Class({
		implements : ['select'],
		initialize : function()
		{
			this.serviceName = 'grubbot:navigation';
			this.importServices = 'applications-nav,modules'.split(',');

			SYMPHONY.services.make(this.serviceName, this, this.implements, true);

			SAPPHIRE.application.listen('start', this.onStart.bind(this));
			GRUBBOT.events.listen('start', this.onReady.bind(this));
		},

		select : function(id)
		{
			var options = {
				canFloat: true
			};

			this.modulesService.show('calendar', {title: 'Grubbot Calendar', icon: GRUBBOT.baseUrl + 'grubbot/assets/images/grubbot-small.png'}, this.serviceName, GRUBBOT.baseUrl + 'calendar', options);
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
			this.navService = SYMPHONY.services.subscribe('applications-nav');
			this.modulesService = SYMPHONY.services.subscribe('modules');
			this.navService.add('calendar', {title: 'Grubbot Calendar', icon: GRUBBOT.baseUrl + 'grubbot/assets/images/grubbot-small.png'}, this.serviceName);
		}
	})
});

new Grubbot.Services.Navigation();
