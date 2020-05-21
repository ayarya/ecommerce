const express = require('express');
const produtsRepo = require('../repositories/products');
const productsIndexTemplate = require('../views/products/index');

const router = express.Router();

router.get('/', async (req, res) => {
	const products = await produtsRepo.getall();
	res.send(productsIndexTemplate({ products }));
});

module.exports = router;
