const mongoose = require('mongoose');
const Review = require('./review')

const Schema = mongoose.Schema;

const imageSchema = new Schema({
        url: String,
        filename: String
})

imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200')
})

const opts = {toJSON:{
    virtuals:true
}};

const campgroundSchema = new Schema({
    title: {
        type:String 
    },
    price:Number,
    description:String,
    location:String,
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required: true
        },
        coordinates:{
            type:[Number],
            required: true
        }
    },
    images: [imageSchema],
    reviews:[{
        type: Schema.Types.ObjectId,
        ref:'Review'
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
},opts);

campgroundSchema.virtual('properties.popMarkup').get(function(){
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0,20)}...`
})

campgroundSchema.post('findOneAndDelete', async function(campground){
    console.log("inside middlware delete")
    console.log(campground)
    if(campground){
       await Review.deleteMany({
        _id: {
            $in: campground.reviews
        }
       })
    }
})

const Campground = mongoose.model('Campground',campgroundSchema);

module.exports = Campground;

