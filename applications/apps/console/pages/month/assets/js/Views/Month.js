Package('Console.Views', {
	Month : new Class({
		Extends : Sapphire.View,

		initialize : function()
		{
			this.parent();
			this.page = $('#month-page');
			this.page.find('#month-prev').click(this.fire.bind(this, 'prev'));
			this.page.find('#month-next').click(this.fire.bind(this, 'next'));
			this.month = {};
		},

		getStar : function(part)
		{
			part = Math.max(part, 0);
			var emptyStar = CONSOLE.baseUrl + '/grubbot/assets/images/star_sm.png';
			var halfStar = CONSOLE.baseUrl + '/grubbot/assets/images/half-star_sm.png';
			var fullStar = CONSOLE.baseUrl + '/grubbot/assets/images/full-star_sm.png';

			if (part === 0) return '<img src="' + emptyStar + '" />';
			if (part <= 0.5) return '<img src="' + halfStar + '" />';
			else return '<img src="' + fullStar + '" />';
		},

		getStars : function(average)
		{
			average = Math.round(average * 2) / 2;
			var stars = '';

			stars += this.getStar(average);
			stars += this.getStar(average - 1);
			stars += this.getStar(average - 2);
			stars += this.getStar(average - 3);
			stars += this.getStar(average - 4);

			return stars;
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
				var start = new Date(date);
				start.setHours(0, 0, 0, 0);
				var cur = new Date(date);
				cur.increment('day', day - 1);

				dayTemplate.find('.date').text(day);
				dayTemplate.on('drop', this.onDrop.bind(this, cur));
				dayTemplate.on('dragover', this.onDragOver.bind(this));
				dayTemplate.click(this.onClick.bind(this, cur));

				var thisDay = this.month[parseInt(cur.getTime(), 10)];
				if (thisDay)
				{
					var mealList = [];
					thisDay.meals.each(function(meal)
					{
						var rating = this.ratings[meal.id];
						var href = CONSOLE.baseUrl + 'console/services/grub/downloadMenu?name=' + meal.menu;

						var mealStr = '<a href="' + href + '">' +
							$('<span>').text(meal.type).text() + '</a>';

						if (rating) {
							var stars = this.getStars(rating.average);
							mealStr += '<br/>' + stars;
						}

						mealList.push(mealStr);
					}, this);

					mealList = mealList.join('<br/>');
					dayTemplate.find('.day-meals').html(mealList);
					var links = dayTemplate.find('.day-meals a');
					links.each(function(idx, el)
					{
						var el = $(el);
						el.click(this.onLinkClick.bind(this, el.attr('href')));
					}.bind(this));
				}
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
				else this.drawDay(week, start + idx - skip, date);
			}

			container.append(week);
		},

		drawMonth : function(current)
		{
			var monthName = current.format('%B');
//			var monthStart = new Date(current.getFullYear(), current.getMonth(), 1);
//			var monthStop = new Date(current.getFullYear(), current.getMonth(), current.get('lastdayofmonth'));
			var monthStart = new Date(current.getFullYear(), current.getMonth(), 1);
			var monthStop = new Date(current.getFullYear(), current.getMonth() + 1, 0);
			var weeks = current.getWeeksInMonth();
			var container = this.page.find('.month-container');
			container.empty();

			var day = 1

			for (var idx = 0; idx < weeks; idx++)
			{
				var skip = (idx == 0) ? monthStart.getDay() : 0;
				this.drawWeek(container, skip, day, monthStop.getDate(), monthStart);
				day += 7 - skip;
			}

			this.page.find('#month-name').text(monthName);

		},

		draw : function(current, month, ratings)
		{
			this.current = current;
			this.ratings = ratings;
			this.month = {};
			month.each(function(day)
			{
				this.month[parseInt(day.date, 10)] = day;
			}, this);

			this.drawMonth(this.current);
		},

		onDrop : function(date, event)
		{
			event.preventDefault();
			event.stopPropagation();
			var dt = event.originalEvent.dataTransfer;

			this.fire('drop', date, dt.files);
		},

		onDragOver : function(event)
		{
			event.preventDefault();
			event.stopPropagation();
		},

		onClick : function(date)
		{
			event.preventDefault();
			event.stopPropagation();

			this.fire('click', date);
		},

		onLinkClick(href, e)
		{
			e.preventDefault();
			e.stopPropagation();
			var modules = SYMPHONY.services.subscribe('modules');

			modules.openLink(href);
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


