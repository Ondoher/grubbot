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
			this.view.listen('drop', this.onDrop.bind(this));
			this.view.listen('click', this.onClick.bind(this));

			this.grubModel = SAPPHIRE.application.getModel('grub');
		},

		onShow : function(panel, query)
		{
			this.view.draw(this.current);
		},

		onClick : function(date)
		{
			SAPPHIRE.application.showPage('day', date);
		},

		onDrop : function(date, files)
		{
			console.log('dropped', files);
			this.grubModel.create(date, files[0])
				.then(function(grub) {
					console.log('created grub menu', grub);
					SAPPHIRE.application.showPage('day', date);
				}.bind(this));
		}
	})
});

SAPPHIRE.application.registerController('month', new Console.Controllers.Month());
