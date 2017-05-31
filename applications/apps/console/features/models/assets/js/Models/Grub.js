Package('Console.Models', {
	Grub : new Class({
		Extends : Sapphire.Model,

		initialize : function()
		{
			this.parent();
		},

		create : function(date, file)
		{
			var fd = new FormData();
			fd.append('date', date.getTime());
			fd.append('pod', CONSOLE.pod);
			fd.append('menu', file);

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
					return grub
				}.bind(this));
		},

		getMonth : function(date)
		{
			return CONSOLE.service.call(CONSOLE.urls.getGrubMonth, {date: date.getTime(), pod: CONSOLE.pod}, 'POST')
				.then(function(data) {
					if (data && !data.success) return Q.reject(new Error(data.error));

					grub = data.result;
					return grub
				}.bind(this));
		},

		update : function(grub)
		{
			return CONSOLE.service.call(CONSOLE.urls.updateGrub, {grub: JSON.stringify(grub)}, 'POST')
				.then(function(data) {
					if (data && !data.success) return Q.reject(new Error(data.error));

					grub = data.result;
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
			deferred.resolve(response.result);
		},

		onAjaxError : function(deferred, jqXHR, textStatus, errorThrown)
		{
			console.log('ajaxError', jqXHR, textStatus, errorThrown);
			deferred.reject(jqXHR);
		}


	})
});

SAPPHIRE.application.registerModel('grub', new Console.Models.Grub());
