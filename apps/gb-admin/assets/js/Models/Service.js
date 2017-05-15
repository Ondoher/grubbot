Package('GbAdmin', {
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

GB_ADMIN.service = new GbAdmin.Service();
