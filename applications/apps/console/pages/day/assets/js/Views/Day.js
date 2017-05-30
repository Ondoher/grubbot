Package('Console.Views', {
	Day : new Class({
		Extends : Sapphire.View,

		initialize : function()
		{
			this.parent();
			this.page = $('#day-page');
			this.page.find('#edit-notification').timepicki();
			this.page.find('#edit-send').timepicki();
			this.page.find('#edit-close').timepicki();
			this.page.find('#save-menu').click(this.onSaveClick.bind(this));
			this.page.find('#day-done-button').click(this.onDoneClick.bind(this));
			this.selected = false;
			this.dropZone = this.page.find('#drop-zone');
			this.dropZone.on('drop', this.onDrop.bind(this));
			this.dropZone.on('dragover', this.onDragOver.bind(this));
		},

		draw : function(grub, update)
		{
			this.meals = [];
			this.grub = grub;
			this.page.find('#day-date').text(new Date(grub.date).format('%B %e, %Y'));
			var container = this.page.find('#meal-container');
			container.empty();

			if (this.selected === false) this.selected = grub.meals.length - 1;

			grub.meals.each(function(meal, index)
			{
				var template = SAPPHIRE.templates.get('meal-item');
				template.find('#meal-item-type').text(meal.type || '');
				template.find('#meal-item-venue').text(meal.venue || '');
				template.find('#meal-item-notification').text(new Date(meal.notification).format('%l:%M %p'));
				template.find('#meal-item-send').text(new Date(meal.start).format('%l:%M %p'));
				template.find('#meal-item-close').text(new Date(meal.end).format('%l:%M %p'));
				template.find('.item-delete-button').click(this.onDelete.bind(this, index));
				template.click(this.onMealClick.bind(this, index));

				this.meals.push({meal: meal, template: template, index: index});

				container.append(template);
			}, this);

			if (this.meals.length) this.drawSelected();
		},

		drawSelected : function()
		{
			if (this.selected >= this.grub.meals.length) this.selected = this.grub.meals.length - 1;

			var template = this.meals[this.selected].template;

			$('.meal-item').removeClass('current');
			template.addClass('current');

			var meal = this.meals[this.selected].meal;

			this.page.find('#edit-venue').val(meal.venue)
			this.page.find('#edit-type').val(meal.type)
			this.setInputTime(this.page.find('#edit-notification'), meal.notification);
			this.setInputTime(this.page.find('#edit-send'), meal.start);
			this.setInputTime(this.page.find('#edit-close'), meal.end);
			this.page.find('#menu-pdf').text(meal.menu);
		},

		setInputTime : function(el, time)
		{
			var time = new Date(time);
			el.val(time.format('%I:%M %p'));
			el.attr('data-timepicki-tim', time.format('%I'));
			el.attr('data-timepicki-mini', time.format('%M'));
			el.attr('data-timepicki-meri', time.format('%p'));
		},

		getInputTime : function(el)
		{
			var hour = parseInt(el.attr('data-timepicki-tim'), 10);
			var minute = parseInt(el.attr('data-timepicki-mini'), 10);
			var meri = el.attr('data-timepicki-meri');
			var result = new Date(this.grub.date);

			if (meri.charAt(0).toLowerCase() === 'p') hour += 12;

			result.setHours(hour);
			result.setMinutes(minute);

			return result.getTime();
		},

		onMealClick : function(index)
		{
			this.selected = index;
			this.drawSelected();
		},

		onSaveClick : function()
		{
			var meal = this.meals[this.selected].meal;

			meal.type = this.page.find('#edit-type').val();
			meal.venue = this.page.find('#edit-venue').val();
			meal.notification = this.getInputTime(this.page.find('#edit-notification'));
			meal.start = this.getInputTime(this.page.find('#edit-send'));
			meal.end = this.getInputTime(this.page.find('#edit-close'));

			this.draw(this.grub);

			this.fire('save', this.grub);
		},

		onDoneClick : function()
		{
			this.fire('done');
		},

		onDelete : function(index, event)
		{
			event.preventDefault();
			event.stopPropagation();

			this.grub.meals.splice(index, 1);
			this.draw(this.grub);
			this.fire('save', this.grub);
		},

		onDrop : function(event)
		{
			event.preventDefault();
			event.stopPropagation();
			var dt = event.originalEvent.dataTransfer;

			this.fire('drop', this.grub, this.selected, dt.files);
		},

		onDragOver : function(event)
		{
			event.preventDefault();
			event.stopPropagation();
		}
	})
});
