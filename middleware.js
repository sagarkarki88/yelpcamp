const {campgroundJoiSchema,reviewJoiSchema} = require('./valSchema')
const AppError = require('./utilities/Apperror')
const campCollection = require('./models/campground')
const review = require('./models/review')

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Access denied Please Sign-in')
        return res.redirect('/login')
    }
    else{
        next()
    }
}

module.exports.joiValidator = (req,res,next)=>{
    const {error} = campgroundJoiSchema.validate(req.body)
    if(error){
        const message = error.details.map(el=> el.message).join(',')
        throw new AppError(message,400)
    }else{
        next()
    }
    
}
module.exports.authorValidate = async (req,res,next)=>{
    const {id} = req.params;
    const campground = await campCollection.findById(req.params.id)
    if(!(campground.author._id.equals(req.user._id))){
        req.flash('error','Access Denied. !! ')
        return res.redirect(`/campgrounds`)
    }
    next()
}

module.exports.joiReviewValidator = (req,res,next)=>{
    const {error} = reviewJoiSchema.validate(req.body)
    if(error){
        const message = error.details.map(el=> el.message).join(',')
        throw new AppError(message,400)
    }else{
        next()
    }
}
module.exports.validateAuthor = async(req,res,next)=>{
    const {id,reviewid} = req.params;
    const foundReview = await review.findById(reviewid).populate('author')
    if(!req.user.equals(foundReview.author._id)){
        req.flash('error','access denied. Cannot delete review please sign-in as a owner')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.storeReturnTo  = (req,res,next)=>{
    if(req.session.returnTo){
        res.locals.url = req.session.returnTo
    }
    next()
}



