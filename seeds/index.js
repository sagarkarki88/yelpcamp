/**************************************
*********** PROJECT --> Yelp CampGround *********
****************************************/
if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}


const multer = require('multer')
const {storage} = require('../cloudinary/index')
const upload = multer({storage})

const mongoose = require('mongoose')
const campground = require('../models/campground')
const citiesData = require('./cities');
const { descriptors, places } = require('./seedHelper');

const mbcGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapboxToken ='pk.eyJ1Ijoic2FnYXJrYXJraTg4IiwiYSI6ImNsaHdscHg4YTBoeHEzc3BhNGsxczN1dXEifQ.MOd5mUG75MiQAxUvjenM5A'
const geoCoder = mbcGeocoding({ accessToken: mapboxToken});


mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

/* const seedCampground = [{
    title: "hideout park"
},
{
    title: "campground with fire",
    price: "$20"
}]; */

/* campground.insertMany(citiesData) */

/* instead of putting random number to array because 
we dont know the size of an array we create a random function where it takes array 
and generate a random number of its length */
const sample = array => array[Math.floor(Math.random()* array.length)];

/* function sample1(array){
    return (array[Math.floor(Math.random()*array.length)])
} */


const seedDB = async ()=>{
    await campground.deleteMany({})
    for(i=0;i<100;i++){
        const randomentry = Math.floor(Math.random() * 1000)
        const c = new campground({
            author: '64562eaaeeac74a3e1b52701',
            location: `${citiesData[randomentry].city}, ${citiesData[randomentry].state}`,
            title: `${sample(descriptors)}, ${sample(places)}`,
            price: Math.floor(Math.random() *20),
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum repudiandae aperiam sit laboriosam fugit, ex animi maxime temporibus magnam officiis fuga? Corrupti accusamus saepe totam ad voluptas impedit commodi accusantium.",
            images:{
                url: 'https://source.unsplash.com/collection/483251'
            }
        });
        const gecoded = await geoCoder.forwardGeocode({
            query: c.location,
            limit:1
        }).send()
        c.geometry = gecoded.body.features[0].geometry
        await c.save();
    }
    
}

seedDB().then(()=>{
    mongoose.connection.close() /* closing mangoose connection to DB */
});