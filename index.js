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

app.get('/', (req, res) => {
	res.send(`
    <form method="POST">
        <input name="email" placeholder="Email" />
        <input name="password" placeholder="password" />
        <input name="passwordConfirmation" placeholder="passwordconfirmation" />
        <button>Sign Up</button>
    </form>
    `);
});

app.post('/', async (req, res) => {
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

app.listen(3000, () => {
	console.log('listening ');
});
