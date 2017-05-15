Package('Console.Models', {
	Grub : new Class({
		Extends : Sapphire.Model,

		initialize : function()
		{
			this.parent();
		},

		create : function(date, file)
		{
			return CONSOLE.service.upload(CONSOLE.urls.createGrub, {bot: JSON.stringify(bot)}, 'POST')
				.then(function(data)
				{
				}.bind(this));
		}
	})
});

SAPPHIRE.application.registerModel('bot', new Console.Models.Grub());
