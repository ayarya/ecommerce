const fs = require('fs');

class UserRepository {
	constructor(filename) {
		// require synchronus function
		if (!filename) {
			throw new Error('Creating a repository require a File name');
		}
		this.filename = filename;
		try {
			fs.accessSync(this.filename);
		} catch (err) {
			fs.writeFileSync(this.filename, []);
		}
	}
}

const repo = new UserRepository('users.json');
