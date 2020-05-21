const { validationResult } = require('express-validator');

module.exports = {
	handleErrors(templateFunc) {
		// all middleware must return function

		return (req, res, next) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.send(templateFunc({ errors }));
			}
			next();
		};
	}
};
