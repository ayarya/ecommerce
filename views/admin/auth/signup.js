const layout = require('../layout');

module.exports = ({ req }) => {
	return layout({
		content: `
        <div>
            <form method="POST">
                <input name="email" placeholder="Email" />
                <input name="password" placeholder="password" />
                <input name="passwordConfirmation" placeholder="passwordconfirmation"/>
                <button>Sign Up</button>
            </form>
        </div>`
	});
};
