Package('Grubbot', {
	Service : new Class({
		Extends : Sapphire.Eventer,
		Implements: [Sapphire.Services.AjaxService],

		initialize : function()
		{
			this.parent();
			this.initializeAjaxService(true);
		}
	})
});

GRUBBOT.service = new Grubbot.Service();
