const mongoose = require('mongoose');
const autoIncrement = require('mongoose-plugin-autoinc');

const itemSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: false
       },
    name: {
        type: String,
        required: true,
        maxlength: 80,
    },
    commonName: {
        type: String,
        required: true,
        maxlength: 300,
    },
    alternateName: {
        type: String,
        required: false,
    },
    stock: {
        type: Number,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    active: {
        type: Boolean,
        required: false,
        default: true
    },
    properties: {
        height: {
            type: Number,
            required: false,
        },
        color: {
            type: String,
            required: false,
        },
    },
});

itemSchema.plugin(autoIncrement.plugin, {
    model: 'Item',
    field: 'id',
    startAt: 9000,
    incrementBy: 1,
});
const Item = mongoose.model('Item', itemSchema);
exports.Item = Item;
