const express = require('express');
const college = require('../controllers/college.js');
const router = express.Router();

router.post('/login', college.login);
router.post('/signup', college.signup);

module.exports = router
