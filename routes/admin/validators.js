const { check } = require('express-validator');
const usersRepo = require('../../repositories/users.js');

module.exports = {
	requireTitle: check('title')
		.trim()
		.isLength({ min: 5, max: 40 })
		.withMessage('Must be between 5 and 40 characters'),
	requirePrice: check('price').trim().toFloat().isFloat({ min: 1 }).withMessage('Must be a number greater than 1 '),
	requireEmail: check('email')
		.trim()
		.normalizeEmail()
		.isEmail()
		.withMessage('Must be a valid email')
		.custom(async (email) => {
			const exisitingUser = await usersRepo.getOneBy({ email });
			if (exisitingUser) {
				throw new Error('Email in Use');
			}
		}),
	requirePassword: check('password')
		.trim()
		.isLength({ min: 4, max: 20 })
		.withMessage('Must be between 4 & 20 characters'),
	requirePasswordConfirmation: check('passwordConfirmation')
		.trim()
		.isLength({ min: 4, max: 20 })
		.withMessage('Password must match')
		.custom(async (passwordConfirmation, { req }) => {
			if (passwordConfirmation !== req.body.password) {
				throw new Error('Password must match');
			}
		}),
	requireEmailExists: check('email')
		.trim()
		.normalizeEmail()
		.isEmail()
		.withMessage('Must be a valid email')
		.custom(async (email) => {
			const exisitingUser = await usersRepo.getOneBy({ email });
			if (!exisitingUser) {
				throw new Error('Email not found');
			}
		}),
	requireValidPassword: check('password').trim().custom(async (password, { req }) => {
		const user = await usersRepo.getOneBy({ email: req.body.email });
		if (!user) {
			throw new Error('Invalid Password');
		}
		const validPassword = await usersRepo.comparePasswords(user.password, password);
		if (!validPassword) {
			throw new Error('Invalid Password');
		}
	})
};
