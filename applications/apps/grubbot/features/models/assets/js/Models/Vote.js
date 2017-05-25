Package('Grubbot.Models', {
	Vote : new Class({
		Extends : Sapphire.Model,

		initialize : function()
		{
			this.parent();
		},

		get : function(meal, user)
		{
			return GRUBBOT.service.call(GRUBBOT.urls.getVote, {meal: meal, user: user}, 'POST')
				.then(function(data) {
					if (data && !data.success) return Q.reject(new Error(data.error));

					return data.result;
				}.bind(this));
		},

		count : function(meal)
		{
			return GRUBBOT.service.call(GRUBBOT.urls.getVoteCount, {meal: meal}, 'POST')
				.then(function(data) {
					if (data && !data.success) return Q.reject(new Error(data.error));

					return data.result;
				}.bind(this));
		},

		vote : function(meal, user, value)
		{
			return GRUBBOT.service.call(GRUBBOT.urls.vote, {meal: meal, user: user, value: value}, 'POST')
				.then(function(data) {
					if (data && !data.success) return Q.reject(new Error(data.error));

					return data.result;
				}.bind(this));
		},

		result : function(meal)
		{
			return GRUBBOT.service.call(GRUBBOT.urls.getVoteResult, {meal: meal}, 'POST')
				.then(function(data) {
					if (data && !data.success) return Q.reject(new Error(data.error));

					return data.result;
				}.bind(this));
		},
	})
});

SAPPHIRE.application.registerModel('vote', new Grubbot.Models.Vote());
