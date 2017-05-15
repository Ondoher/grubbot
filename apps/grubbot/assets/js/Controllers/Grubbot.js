Package('Grubbot.Controllers', {
	Grubbot : new  Class({
		Extends: Sapphire.Controller,

		initialize : function()
		{
			this.parent();
			SAPPHIRE.application.listen('start', this.onStart.bind(this));
			SAPPHIRE.application.listen('ready', this.onReady.bind(this));
		},

		onStart : function(callback)
		{
			callback();
		},

		onReady : function()
		{
			this.view = new Grubbot.Views.Grubbot();
		}
	})
});

SAPPHIRE.application.registerController('grubbot', new Grubbot.Controllers.Grubbot());
