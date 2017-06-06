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
			this.view.listen('new-drop', this.onNewDrop.bind(this));
			this.view.listen('done', this.onDone.bind(this));
			this.grubModel = SAPPHIRE.application.getModel('grub');
		},

		onShow : function(day)
		{
			this.view.clear();
			this.grubModel.get(day)
				.then(function(grub)
				{
					this.view.draw(grub)
				}.bind(this));
		},

		onSave : function(grub)
		{
			this.grubModel.update(grub);
		},

		onDrop : function(grub, selected, files)
		{
			this.grubModel.updateMenu(grub, selected, files[0])
				.then(function(grub) {
					this.view.draw(grub)
				}.bind(this));
		},

		onNewDrop : function(grub, selected, files)
		{
			return this.grubModel.create(new Date(grub.date), files && files[0])
				.then(function(grub) {
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
