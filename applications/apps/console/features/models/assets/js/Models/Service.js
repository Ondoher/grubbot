Package('Console', {
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

CONSOLE.service = new Console.Service();
