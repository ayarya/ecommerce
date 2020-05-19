const express = require('express');
const usersRepo = require('../../repositories/users.js');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');

const router = express.Router();

router.get('/signup', (req, res) => {
	res.send(signupTemplate({ req }));
});

router.post('/signup', async (req, res) => {
	const { email, password, passwordConfirmation } = req.body;
	const exisitingUser = await usersRepo.getOneBy({ email: email });
	if (exisitingUser) {
		return res.send('Email in Use');
	}
	if (password !== passwordConfirmation) {
		return res.send('Password must match');
	}
	const user = await usersRepo.create({ email, password }); // email : email, es6>
	req.session.userId = user.id;
	res.send('Done');
});

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
