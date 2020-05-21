const express = require('express');

const { handleErrors } = require('./middlewares');
const usersRepo = require('../../repositories/users.js');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const {
	requireEmail,
	requirePassword,
	requirePasswordConfirmation,
	requireEmailExists,
	requireValidPassword
} = require('./validators');

const router = express.Router();

router.get('/signup', (req, res) => {
	res.send(signupTemplate({ req }));
});

router.post(
	'/signup',
	[ requireEmail, requirePassword, requirePasswordConfirmation ],
	handleErrors(signupTemplate),
	async (req, res) => {
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
	res.send(signinTemplate({}));
});

router.post('/signin', [ requireEmailExists, requireValidPassword ], handleErrors(signinTemplate), async (req, res) => {
	const { email } = req.body;
	const user = await usersRepo.getOneBy({ email });

	req.session.userId = user.id;
	res.send('you are sign in');
});

module.exports = router;
