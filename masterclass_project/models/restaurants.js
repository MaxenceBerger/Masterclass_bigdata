const mongoose = require('mongoose');

const schema = mongoose.Schema(
    {
        location: {
            coordinates: [Number, Number],
            type: { type: String }
        },
        name: { type: String },
        price: { type: Number },
        reviews: [{ type: Number }]
    },
    { versionKey: false }
);

// schema.index({ 'location': '2dsphere' });

module.exports = mongoose.model('restaurants', schema);

