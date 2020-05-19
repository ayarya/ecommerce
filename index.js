const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const usersRepo = require('./repositories/users.js');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	cookieSession({
		keys: [ 'abcdefg' ]
	})
);

app.get('/signup', (req, res) => {
	res.send(`
    <form method="POST">
        <input name="email" placeholder="Email" />
        <input name="password" placeholder="password" />
        <input name="passwordConfirmation" placeholder="passwordconfirmation" />
        <button>Sign Up</button>
    </form>
    `);
});

app.post('/signup', async (req, res) => {
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

app.get('/signout', (req, res) => {
	req.session = null;
	res.send('you are log out');
});

app.get('/signin', (req, res) => {
	res.send(`
    <form method="POST">
        <input name="email" placeholder="Email" />
        <input name="password" placeholder="password" />
        <button>Sign In</button>
    </form>
    `);
});

app.post('/signin', async (req, res) => {
	const { email, password } = req.body;
	const user = await usersRepo.getOneBy({ email });
	if (!user) {
		return res.send('Email not found');
	}
	if (user.password !== password) {
		return res.send('password not correct');
	}
	req.session.userId = user.id;
	res.send('you are sign in');
});
app.listen(3000, () => {
	console.log('listening ');
});
