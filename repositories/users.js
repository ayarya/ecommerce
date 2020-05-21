const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');
const scrypt = util.promisify(crypto.scrypt);

class UserRepository extends Repository {
	async create(attrib) {
		//{key:"value", key:"value"}
		attrib.id = this.randomId();
		const salt = crypto.randomBytes(8).toString('hex');
		const buf = await scrypt(attrib.password, salt, 64);
		const records = await this.getall();
		const record = {
			...attrib,
			password: `${buf.toString('hex')}.${salt}`
		};
		records.push(record);
		await this.writeall(records);
		return record;
	}

	async comparePasswords(saved, supplied) {
		const [ hashed, salt ] = saved.split('.');
		const hashSupplied = await scrypt(supplied, salt, 64);
		return hashed === hashSupplied.toString('hex');
	}
}

module.exports = new UserRepository('users.json');
