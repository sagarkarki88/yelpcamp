const campCollection = require('../models/campground')
const Review = require('../models/review')
module.exports.createNew = async(req,res)=>{
    const {id} = req.params;
    const campground = await campCollection.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    req.flash('reviewFlashAdd','New review added successfully')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.delete = async(req,res)=>{
    const {id,reviewid} = req.params;
    const campground = await campCollection.findByIdAndUpdate(id,{$pull:{reviews: reviewid}})
    const review = await Review.findByIdAndDelete(reviewid)
    req.flash('reviewDelete','Review Deleted successfully')
    res.redirect(`/campgrounds/${id}`)
}