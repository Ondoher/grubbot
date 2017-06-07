Package('Console.Models', {
	Grub : new Class({
		Extends : Sapphire.Model,

		initialize : function()
		{
			this.parent();
			this.grubs = {};
		},

		getLunch : function(date)
		{
			return {
				type: 'Lunch',
				notification: date + 9 * 60 * 60 * 1000,
				start: date + 13 * 60 * 60 * 1000,
				end: date + 17 * 60 * 60 * 1000,
			};
		},

		getDinner : function(date)
		{
			return {
				type: 'Dinner',
				notification: date + 15 * 60 * 60 * 1000,
				start: date + 18 * 60 * 60 * 1000,
				end: date + 23 * 60 * 60 * 1000,
			};
		},

		newMeal : function(date)
		{
			var grub = this.grubs[date];
			if (!grub) return this.getLunch(date);

			if (grub.meals.length === 0) return this.getLunch(grub.date);
			else return this.getDinner(grub.date);
		},

		create : function(date, file, meal)
		{
			date.setHours(0, 0, 0, 0);

			var fd = new FormData();

			if (file && !meal) meal = this.newMeal(date.getTime());

			fd.append('date', date.getTime());
			fd.append('pod', CONSOLE.pod);
			if (meal) fd.append('meal', JSON.stringify(meal));
			if (file) fd.append('menu', file);

			var deferred = Q.defer();
			var type = 'json';
			var csrfCode = Cookie.read('sapphire-csrf');
			if (csrfCode && this.useCsrf) fd.append('csrfCode', csrfCode);

			method = 'POST';

			$.ajax({
				url: CONSOLE.urls.createGrub,
				type: 'POST',
				data: fd,
				contentType:false,
				processData: false,
				cache: false,
				error: this.onAjaxError.bind(this, deferred),
				success: this.onAjaxSuccess.bind(this, deferred),
				xhr: function() {
					var xhrobj = $.ajaxSettings.xhr();
					if (xhrobj.upload) {
							xhrobj.upload.addEventListener('progress', function(event) {
								var percent = 0;
								var position = event.loaded || event.position;
								var total = event.total;
								if (event.lengthComputable) {
									percent = Math.ceil(position / total * 100);
								}
								//Set progress
								//status.setProgress(percent);
							}, false);
						}
					return xhrobj;
				},
				xhrFields: {
					withCredentials: true
				}
			});

			return deferred.promise;
		},

		get : function(date)
		{
			return CONSOLE.service.call(CONSOLE.urls.getGrub, {date: date.getTime(), pod: CONSOLE.pod}, 'POST')
				.then(function(data) {
					if (data && !data.success) return Q.reject(new Error(data.error));

					grub = data.result;
					this.grubs[grub.date] = grub;
					return grub
				}.bind(this));
		},

		getRange : function(start, stop)
		{
			return CONSOLE.service.call(CONSOLE.urls.getGrubRange, {start: start, stop: stop, pod: CONSOLE.pod}, 'POST')
				.then(function(data) {
					if (data && !data.success) return Q.reject(new Error(data.error));

					grubs = data.result;
					grubs.each(function(grub)
					{
						this.grubs[grub.date] = grub;
					}, this);
					return grubs;
				}.bind(this));
		},

		update : function(grub)
		{
			return CONSOLE.service.call(CONSOLE.urls.updateGrub, {grub: JSON.stringify(grub)}, 'POST')
				.then(function(data) {
					if (data && !data.success) return Q.reject(new Error(data.error));

					grub = data.result;
					this.grubs[grub.date] = grub;
					return grub
				}.bind(this));
		},

		updateMenu : function(grub, selected, file)
		{
			var fd = new FormData();
			fd.append('grub', JSON.stringify(grub));
			fd.append('index', selected);
			if (file) fd.append('menu', file);

			var deferred = Q.defer();
			var type = 'json';
			var csrfCode = Cookie.read('sapphire-csrf');
			if (csrfCode && this.useCsrf) fd.append('csrfCode', csrfCode);

			method = 'POST';

			$.ajax({
				url: CONSOLE.urls.updateGrubMenu,
				type: 'POST',
				data: fd,
				contentType:false,
				processData: false,
				cache: false,
				error: this.onAjaxError.bind(this, deferred),
				success: this.onAjaxSuccess.bind(this, deferred),
				xhr: function() {
					var xhrobj = $.ajaxSettings.xhr();
					if (xhrobj.upload) {
							xhrobj.upload.addEventListener('progress', function(event) {
								var percent = 0;
								var position = event.loaded || event.position;
								var total = event.total;
								if (event.lengthComputable) {
									percent = Math.ceil(position / total * 100);
								}
								//Set progress
								//status.setProgress(percent);
							}, false);
						}
					return xhrobj;
				},
				xhrFields: {
					withCredentials: true
				}
			});

			return deferred.promise;
		},

		onAjaxSuccess : function(deferred, response, status, xhr)
		{
			grub = response.result;
			this.grubs[grub.date] = grub;

			deferred.resolve(grub);
		},

		onAjaxError : function(deferred, jqXHR, textStatus, errorThrown)
		{
			console.log('ajaxError', jqXHR, textStatus, errorThrown);
			deferred.reject(jqXHR);
		}
	})
});

SAPPHIRE.application.registerModel('grub', new Console.Models.Grub());
