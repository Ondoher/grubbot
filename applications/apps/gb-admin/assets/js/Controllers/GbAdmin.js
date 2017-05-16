Package('GbAdmin.Controllers', {
	GbAdmin : new  Class({
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
			this.view = new GbAdmin.Views.GbAdmin();
		}
	})
});

SAPPHIRE.application.registerController('gb-admin', new GbAdmin.Controllers.GbAdmin());
