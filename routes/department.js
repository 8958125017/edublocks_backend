const express = require('express');
const department = require('../controllers/department.js');
const router = express.Router();
router.post('/studentdetails', department.studentdetails);
router.post('/signup', department.signup);
router.post('/dashboarddata', department.dashboarddata);
router.post('/shareEmail', department.shareEmail);
router.get('/getdatadashbord', department.getdatadashbord);

module.exports = router;
