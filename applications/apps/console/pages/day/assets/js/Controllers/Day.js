Package('Console.Controllers', {
	Day : new Class({
		Extends : Sapphire.Controller,

		initialize : function()
		{
			this.parent();

			SAPPHIRE.application.listenPageEvent('load', 'day', this.onLoad.bind(this));
			SAPPHIRE.application.listenPageEvent('show', 'day', this.onShow.bind(this));
		},

		onLoad : function()
		{
			this.view = new Console.Views.Day();
			this.grubModel = SAPPHIRE.application.getModel('grub');
		},

		onShow : function(day)
		{
			console.log('day', day);
			this.grubModel.get(day)
				.then(function(grub)
				{
					console.log('day grub', grub);
					this.view.draw(grub)
				}.bind(this));
		},
	})
});

SAPPHIRE.application.registerController('day', new Console.Controllers.Day());
