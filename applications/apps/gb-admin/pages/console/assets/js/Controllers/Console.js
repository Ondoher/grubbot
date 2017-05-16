Package('GbAdmin.Controllers', {
	Console : new Class({
		Extends : Sapphire.Controller,

		initialize : function()
		{
			this.parent();

			SAPPHIRE.application.listenPageEvent('load', 'console', this.onLoad.bind(this));
			SAPPHIRE.application.listenPageEvent('show', 'console', this.onShow.bind(this));
		},

		onLoad : function()
		{
			this.view = new GbAdmin.Views.Console();
		},

		onShow : function(panel, query)
		{
			this.view.draw()
		},
	})
});

SAPPHIRE.application.registerController('console', new GbAdmin.Controllers.Console());
