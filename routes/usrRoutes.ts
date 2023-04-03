const express = require('express');
const router = express.Router();
const { cr8User, getUser, loginUser } = require('../controller/usrController');

// --------------------------- user routes --------------------------


router.post('/signin', loginUser)


router.post('/signup', cr8User)


router.get('/getdata', getUser)


export default router;
