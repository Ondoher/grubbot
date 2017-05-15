Package('Console.Controllers', {
	Month : new Class({
		Extends : Sapphire.Controller,

		initialize : function()
		{
			this.parent();

			SAPPHIRE.application.listenPageEvent('load', 'month', this.onLoad.bind(this));
			SAPPHIRE.application.listenPageEvent('show', 'month', this.onShow.bind(this));
			this.current = new Date();
		},

		onLoad : function()
		{
			this.view = new Console.Views.Month();
		},

		onShow : function(panel, query)
		{
			this.view.draw(this.current);
		},
	})
});

SAPPHIRE.application.registerController('month', new Console.Controllers.Month());
