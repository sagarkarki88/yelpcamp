const BaseJoi = require('joi');
const extension = require('no-html-input')

const Joi = BaseJoi.extend(extension)

module.exports.campgroundJoiSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        description: Joi.string().required().escapeHTML(),
        location: Joi.string().required().escapeHTML(),
        //images: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
})

module.exports.reviewJoiSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required().escapeHTML(),
        rating: Joi.number().required().min(0).max(5)
    }).required()
})

