var  fileUpload = require('express-fileupload');
exports.createMiddleware = function(app)
{
	app.use(fileUpload({debug: true}));
};
