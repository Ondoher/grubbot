Package('Console.Views', {
	Month : new Class({
		Extends : Sapphire.View,

		initialize : function()
		{
			this.parent();
			this.page = $('#month-page');
		},

		drawDay : function(weekTemplate, day, date)
		{
			var dayTemplate = SAPPHIRE.templates.get('month-day');
			if (!day)
			{
				dayTemplate.addClass('empty');
			}
			else
			{
				var cur = new Date(date);
				cur.increment('day', day - 1);

				dayTemplate.find('.date').text(day);
				dayTemplate.on('drop', this.onDrop.bind(this, cur));
				dayTemplate.on('dragover', this.onDragOver.bind(this));
			}

			weekTemplate.append(dayTemplate);
		},

		drawWeek : function(container, skip, start, stop, date)
		{
			var week = SAPPHIRE.templates.get('month-week');
			for (var idx = 0; idx < 7; idx++)
			{
				if (idx < skip) this.drawDay(week, 0);
				else if (idx + start > stop) this.drawDay(week, 0)
				else this.drawDay(week, start + idx, date);
			}

			container.append(week);
		},

		drawMonth : function(current)
		{
			var monthName = current.format('%B');
			var monthStart = new Date(current.getFullYear(), current.getMonth(), 1);
			var monthStop = new Date(current.getFullYear(), current.getMonth(), current.get('lastdayofmonth'));
			var weeks = current.getWeeksInMonth();
			var container = this.page.find('.month-container');
			container.empty();

			console.log('month', current.get('Month'), 'monthName', monthName);
			console.log('start', monthStart, 'stop', monthStop);
			console.log('start', monthStart.getDay(), 'stop', monthStop.getDate());
			console.log('weeks', weeks);

			for (var idx = 0; idx < weeks; idx++)
			{
				var skip = (idx == 0) ? monthStart.getDay() : 0;
				this.drawWeek(container, skip, idx * 7, monthStop.getDate(), monthStart);
			}

			this.page.find('#month-name').text(monthName);

		},

		draw : function(current)
		{
			this.current = current;
			this.drawMonth(this.current);
		},

		onDrop : function(date, event)
		{
			event.preventDefault();
			event.stopPropagation();
			var dt = event.originalEvent.dataTransfer;
			console.log('drop', date);
			console.log(event, dt);
			console.log(dt.items);
			console.log(dt.items[0]);
			console.log(dt.files);
			console.log(dt.files[0]);

			this.fire('drop', date, dt.files);
		},

		onDragOver : function(event)
		{
			console.log('dragover');
			event.preventDefault();
			event.stopPropagation();
		}

	})
});

Date.prototype.getWeeksInMonth = function() {
//	var firstOfMonth = new Date(year, month_number-1, 1);
	var firstOfMonth = new Date(this.getFullYear(), this.getMonth(), 1);
	var lastOfMonth  = new Date(this.getFullYear(), this.getMonth(), this.get('lastdayofmonth'));
	var used         = firstOfMonth.getDay() + lastOfMonth.getDate();
	return Math.ceil( used / 7);
}


