Package('Console.Controllers', {
	Main : new Class({
		Extends : Sapphire.Controller,

		initialize : function()
		{
			this.parent();

			SAPPHIRE.application.listen('ready', this.onReady.bind(this));
		},

		onReady : function()
		{
			this.view = new Console.Views.Main();
			this.view.draw()

			SAPPHIRE.application.showPage('month');
		}
	})
});

SAPPHIRE.application.registerController('main', new Console.Controllers.Main());
