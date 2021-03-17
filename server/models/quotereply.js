const mongoose = require('mongoose');

var quoteReplySchema = new mongoose.Schema({
    id: {
        type: Number,
        required: false,
    },
    from: {
        type: String,
        required: false,
    },
    date: {
        type: String,
        required: false,
    },
    notes: {
        type: String,
        required: false,
    },

    items: [
        {
            id: {
                type: Number,
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            commonName: {
                type: String,
                required: false,
            },
            quantity: {
                type: Number,
                required: true,
            },
            qtyallotted: {
                type: Number,
                required: true,
            },
            stock: {
                type: Number,
                required: false,
                default: 0,
            },
            price: {
                type: Number,
                required: false,
                default: 0,
            },
        },
    ]

});

const QuoteReply = mongoose.model('QuoteReply', quoteReplySchema);
exports.QuoteReply = QuoteReply;