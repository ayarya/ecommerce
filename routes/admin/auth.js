const express = require('express');
const { check, validationResult } = require('express-validator');
const usersRepo = require('../../repositories/users.js');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');

const router = express.Router();

router.get('/signup', (req, res) => {
	res.send(signupTemplate({ req }));
});

router.post(
	'/signup',
	[
		check('email').trim().normalizeEmail().isEmail().custom(async (email) => {
			const exisitingUser = await usersRepo.getOneBy({ email });
			if (exisitingUser) {
				throw new Error('Email in Use');
			}
		}),
		check('password').trim().isLength({ min: 4, max: 20 }),
		check('passwordConfirmation')
			.trim()
			.isLength({ min: 4, max: 20 })
			.custom(async (passwordConfirmation, { req }) => {
				if (passwordConfirmation !== req.body.password) {
					throw new Error('Password must match');
				}
			})
	],
	async (req, res) => {
		const errors = validationResult(req);
		console.log(errors);
		const { email, password, passwordConfirmation } = req.body;
		const user = await usersRepo.create({ email, password }); // email : email, es6>
		req.session.userId = user.id;
		res.send('Done');
	}
);

router.get('/signout', (req, res) => {
	req.session = null;
	res.send('you are log out');
});

router.get('/signin', (req, res) => {
	res.send(signinTemplate());
});

router.post('/signin', async (req, res) => {
	const { email, password } = req.body;
	const user = await usersRepo.getOneBy({ email });
	if (!user) {
		return res.send('Email not found');
	}
	const validPassword = await usersRepo.comparePasswords(user.password, password);
	if (!validPassword) {
		return res.send('password not correct');
	}
	req.session.userId = user.id;
	res.send('you are sign in');
});

module.exports = router;
