const express = require('express');
const documents = require('../controllers/documents.js');
const router = express.Router();

router.post('/signup', documents.signup);

module.exports = router
