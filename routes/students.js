const express = require('express');
const students = require('../controllers/students.js');
const router = express.Router();

router.post('/signup', students.signup);

module.exports = router
