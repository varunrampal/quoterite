const mongoose = require('mongoose');

const Picture = mongoose.model(
    'Picture',
    new mongoose.Schema({
        url: {
            type: String,
            required: true,
        },
        receipt_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'receipt',
        },
    })
);

module.exports.Picture = Picture;
