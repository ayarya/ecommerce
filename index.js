const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

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

app.post('/', (re, res) => {
	res.send('Done');
});

app.listen(3000, () => {
	console.log('listening ');
});
