Package('Calendar.Models', {
	Vote : new Class({
		Extends : Sapphire.Model,

		initialize : function()
		{
			this.parent();
		},

		getRangeResult : function(start, stop)
		{
			return CALENDAR.service.call(CALENDAR.urls.getVoteRangeResult, {start: start, stop: stop, pod: CALENDAR.pod}, 'POST')
				.then(function(data) {
					if (data && !data.success) return Q.reject(new Error(data.error));

					return data.result;
				}.bind(this));
		},
	})
});

SAPPHIRE.application.registerModel('vote', new Calendar.Models.Vote());
