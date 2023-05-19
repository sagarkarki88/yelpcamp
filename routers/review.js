const express = require('express');
const router = express.Router({mergeParams:true});
const errorWrap = require('../utilities/catchAsync.js')
const {isLoggedIn,joiReviewValidator,validateAuthor} = require('../middleware.js');
const reviewController = require('../controllers/review.js')

router.post('/',joiReviewValidator,isLoggedIn,errorWrap(reviewController.createNew))

router.delete('/:reviewid',isLoggedIn,validateAuthor,errorWrap(reviewController.delete) )

module.exports = router;