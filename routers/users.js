const express = require('express');
const router = express.Router({mergeParams:true});

const errorWrap = require('../utilities/catchAsync')
const passport = require('passport')
const {storeReturnTo} = require('../middleware')
const userController = require('../controllers/users.js')

router.route('/register')
    .get(userController.renderRegister)
    .post(errorWrap(userController.register))

router.route('/login')
    .get(userController.renderLogin)
    .post(storeReturnTo,passport.authenticate('local',{failureFlash: true, failureRedirect:'/login'}), errorWrap(userController.login))

router.get('/logout',userController.logout)

module.exports = router;
