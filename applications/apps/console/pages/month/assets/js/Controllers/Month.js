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

		createOrLoad : function(date, files)
		{
			return this.grubModel.create(date, files && files[0])
				.then(function(grub) {
					SAPPHIRE.application.showPage('day', date);
				}.bind(this));
		},

		loadMonth : function(month)
		{
			var monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
			var monthStop = new Date(month.getFullYear(), month.getMonth(), month.get('lastdayofmonth'));
		},

		onLoad : function()
		{
			this.view = new Console.Views.Month();
			this.view.listen('drop', this.onDrop.bind(this));
			this.view.listen('click', this.onClick.bind(this));
			this.view.listen('next', this.onNext.bind(this));
			this.view.listen('prev', this.onPrev.bind(this));

			this.grubModel = SAPPHIRE.application.getModel('grub');
		},

		onShow : function()
		{
			this.grubModel.getMonth(this.current)
				.then(function(month)
				{
					console.log(month);
					this.view.draw(this.current, month);
				}.bind(this));

		},

		onClick : function(date)
		{
			this.createOrLoad(date);
		},

		onDrop : function(date, files)
		{
			console.log('dropped', files);
			this.createOrLoad(date, files);
		},

		onNext : function()
		{
			this.current.increment('month');
			this.onShow();
		},

		onPrev : function()
		{
			this.current.decrement('month');
			this.onShow();
		},

	})
});

SAPPHIRE.application.registerController('month', new Console.Controllers.Month());
