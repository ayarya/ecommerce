module.exports = ({ req }) => {
	return `<form method="POST">
                <input name="email" placeholder="Email" />
                <input name="password" placeholder="password" />
                <input name="passwordConfirmation" placeholder="passwordconfirmation"/>
                <button>Sign Up</button>
            </form>`;
};
