const fs = require('fs');

class UserRepository {
	constructor(filename) {
		// constructor require synchronus function
		if (!filename) {
			throw new Error('Creating a repository require a File name');
		}
		this.filename = filename;
		try {
			fs.accessSync(this.filename);
		} catch (err) {
			fs.writeFileSync(this.filename, '[]');
		}
	}

	async getall() {
		//open file, read content, parse json content, return this data
		return JSON.parse(await fs.promises.readFile(this.filename, { encoding: 'utf8' }));
	}

	async create(attrib) {
		//{email:"", pass:""}
		const records = await this.getall();
		records.push(attrib);
		await this.writeall(records);
	}

	async writeall(records) {
		await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
	}
}
const test = async () => {
	const repo = new UserRepository('users.json');
	await repo.create({ email: 'a@gmail.com', password: 'dffs' });
	const users = await repo.getall();
	console.log(users);
};

test();
