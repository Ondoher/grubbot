Package('Calendar.Controllers', {
	Main : new Class({
		Extends : Sapphire.Controller,

		initialize : function()
		{
			this.parent();

			SAPPHIRE.application.listen('ready', this.onReady.bind(this));
		},

		onReady : function()
		{
			this.view = new Calendar.Views.Main();
			this.view.draw()

			SAPPHIRE.application.showPage('month');
		}
	})
});

SAPPHIRE.application.registerController('main', new Calendar.Controllers.Main());
