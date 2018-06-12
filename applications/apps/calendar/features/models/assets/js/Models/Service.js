Package('Calendar', {
	Service : new Class({
		Extends : Sapphire.Eventer,
		Implements: [Sapphire.Services.AjaxService],

		initialize : function()
		{
			this.parent();
			this.initializeAjaxService(true);
		},

		upload : function(file)
		{
		},
	})
});

CALENDAR.service = new Calendar.Service();
