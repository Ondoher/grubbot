Package('Console.Models', {
	Vote : new Class({
		Extends : Sapphire.Model,

		initialize : function()
		{
			this.parent();
		},

		getMonthResult : function(date)
		{
			return CONSOLE.service.call(CONSOLE.urls.getVoteMonthResult, {date: date.getTime(), pod: CONSOLE.pod}, 'POST')
				.then(function(data) {
					if (data && !data.success) return Q.reject(new Error(data.error));

					return data.result;
				}.bind(this));
		},
	})
});

SAPPHIRE.application.registerModel('vote', new Console.Models.Vote());
