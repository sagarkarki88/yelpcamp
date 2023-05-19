const express = require('express');
const router = express.Router({mergeParams:true});
const {isLoggedIn,joiValidator,authorValidate} = require('../middleware')
const errorWrap = require('../utilities/catchAsync.js')
const campground = require('../controllers/campgrounds')


const multer = require('multer')
const {storage} = require('../cloudinary/index')
const upload = multer({storage})

router.route('/')
    .get(errorWrap(campground.showAllCampgrounds))
    .post(isLoggedIn,upload.array('image'),joiValidator,errorWrap(campground.addNew))
   /*  .post(upload.single('campground[image]'),(req,res,next)=>{
        res.send(req.file.path)
    }) */

router.get('/new',isLoggedIn,campground.new)

router.route('/:id')
    .get(errorWrap(campground.showDetails))
    .patch(upload.array('image'),joiValidator,isLoggedIn,authorValidate,errorWrap(campground.update))
    .delete(isLoggedIn,authorValidate,errorWrap(campground.delete))

router.get('/:id/edit',isLoggedIn,authorValidate,errorWrap(campground.renderEdit))
router.get('/:id/delete',isLoggedIn,authorValidate,errorWrap(campground.renderDelete))

module.exports = router;