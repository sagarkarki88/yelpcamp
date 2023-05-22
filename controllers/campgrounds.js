const campCollection = require('../models/campground')
const AppError = require('../utilities/Apperror')
const {cloudinary} = require('../cloudinary')
const axios = require('axios');

const mbcGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapboxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbcGeocoding({ accessToken: mapboxToken});

module.exports.showAllCampgrounds = async (req,res,next)=>{
    const campgrounds = await campCollection.find({})
    if(!campgrounds){
       throw new AppError('cannot find campgroud',404)
    }
    res.render('campgrounds/index',{campgrounds})
}

module.exports.addNew = async (req,res,next)=>{
    /* postman injection check  */
    if (!req.body.campground) throw new AppError('Invalid Campground Data', 400);
    const newSite = new campCollection(req.body.campground);
    newSite.images = req.files.map(f => ({url: f.path , filename: f.filename}))
    newSite.author = req.user._id
    console.log(newSite)
    req.flash('success','Congratulation !!! New CampGoround Added Successfully.')
    await newSite.save()
    res.redirect(`/campgrounds/${newSite.id}`)
    
}

module.exports.showDetails = async (req,res,next)=>{
    const {id} = req.params;
    const campground = await campCollection.findById(id).populate
        ({path: 'reviews',
            populate:{
                path: 'author'}}).populate('author');
    if(!campground){
        req.flash('error','Opps !!! cannot find campground')
        return res.redirect('/campgrounds');
        /* throw new AppError('Campground doesnt exist',404); */
    } 
    res.render('campgrounds/showDetail',{campground})
}
module.exports.new = (req,res)=>{
    res.render('campgrounds/new')
}

module.exports.renderEdit = async(req,res,next)=>{
    const campground = await campCollection.findById(req.params.id)
    if(!campground){
        req.flash('error','Opps !!! cannot find campground')
        return res.redirect('/campgrounds');
       /* throw new AppError('cannot find campground',404) */
    }
    res.render('campgrounds/edit',{campground});
}

module.exports.update = async (req,res,next)=>{
    const {id} = req.params;
    const {deleteImages} = req.body
    console.log(deleteImages)
    const campground = await campCollection.findByIdAndUpdate(id, {...req.body.campground}, {new:true});
    const images = req.files.map(f => ({url: f.path , filename: f.filename}));
    campground.images.push(...images);
    if(req.body.deleteImages){
        for(let filename of deleteImages)
        await cloudinary.uploader.destroy(filename);
        await campground.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})
    }
    if(!campground){
        throw new AppError('cannot find campgroud',404)
    }
    await campground.save()
    req.flash('updateSuccess',`Successfully updated ${campground.title}`)
    res.redirect(`/campgrounds/${campground.id}`) 
}
module.exports.renderDelete = async (req,res,next)=>{
    const campgrounds = await campCollection.findById(req.params.id)
    if(!campgrounds){
        throw new AppError('cannot find campground',404)
    }
    res.render('campgrounds/delete',{campgrounds})
}

module.exports.delete = async (req,res)=>{
    const campground = await campCollection.findByIdAndDelete(req.params.id);
    if(!campground){
        throw AppError('cannot find campgroud',404)
    }
    req.flash('deleted','The campground is No More and Deletion successfull')
    res.redirect('/campgrounds')
}