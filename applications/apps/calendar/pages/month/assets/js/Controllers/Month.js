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

		getMonth : function(date)
		{
			var start = new Date(date.getFullYear(), date.getMonth(), 1);
			var stop = new Date(date.getFullYear(), date.getMonth(), date.get('lastdayofmonth'));

			start.setHours(0, 0, 0, 0);
			stop.setHours(0, 0, 0, 0);

			return {start: start.getTime(), stop: stop.getTime()}
		},

		onLoad : function()
		{
			this.view = new Console.Views.Month();
			this.view.listen('next', this.onNext.bind(this));
			this.view.listen('prev', this.onPrev.bind(this));

			this.grubModel = SAPPHIRE.application.getModel('grub');
			this.voteModel = SAPPHIRE.application.getModel('vote');
		},

		onShow : function()
		{
			var range = this.getMonth(this.current);
			this.grubModel.getRange(range.start, range.stop)
				.then(function(month)
				{
					this.month = month;
					this.voteModel.getRangeResult(range.start, range.stop)
						.then(function(result)
						{
							this.view.draw(this.current, this.month, result);
						}.bind(this));
				}.bind(this));

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
