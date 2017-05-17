Package('Console.Views', {
	Day : new Class({
		Extends : Sapphire.View,

		initialize : function()
		{
			this.parent();
			this.page = $('#day-page');
		},

		draw : function(grub)
		{
			this.page.find('#day-date').text(new Date(grub.date).format('%B %e, %Y'));
			var container = this.page.find('#meal-container');
			container.empty();

			grub.meals.each(function(meal)
			{
				var template = SAPPHIRE.templates.get('meal-item');
				template.find('#meal-item-notification').text(new Date(meal.notification).format('%l:%M %p'));

				container.append(template);
			}, this);
		}
	})
});
