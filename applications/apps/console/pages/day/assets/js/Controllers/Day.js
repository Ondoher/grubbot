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
			this.view.listen('save', this.onSave.bind(this));
			this.view.listen('drop', this.onDrop.bind(this));
			this.view.listen('done', this.onDone.bind(this));
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

		onSave : function(grub)
		{
			console.log('onSave', grub);
			this.grubModel.update(grub);
		},

		onDrop : function(grub, selected, files)
		{
			console.log(this.grubModel);
			this.grubModel.updateMenu(grub, selected, files[0])
				.then(function(grub) {
					console.log('updated grub menu', grub);
					this.view.draw(grub)
				}.bind(this));

		},

		onDone : function()
		{
			SAPPHIRE.application.showPage('month');
		}
	})
});

SAPPHIRE.application.registerController('day', new Console.Controllers.Day());
