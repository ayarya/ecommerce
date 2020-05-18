const fs = require('fs');
const crypto = require('crypto');

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
		//{key:"value", key:"value"}
		attrib.id = this.randomId();
		const records = await this.getall();
		records.push(attrib);
		await this.writeall(records);
	}

	async writeall(records) {
		await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
	}

	randomId() {
		return crypto.randomBytes(4).toString('hex');
	}

	async getOne(id) {
		const records = await this.getall();
		return records.find((record) => record.id === id);
	}
}
const test = async () => {
	const repo = new UserRepository('users.json');
	const user = await repo.getOne('8d6064bfm');
	console.log(user);
};

test();
