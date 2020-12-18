const mongoose = require('mongoose');
const propertySchema = new mongoose.Schema({
    custmail: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        maxlength: 100
    },
    address: {
         street: String,
         city: String,
         postCode: String,
         state: String,
         country: String

    },
    connectInfo: {
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
    }
 
});
const Property = mongoose.model('Property', propertySchema);
exports.Property = Property;

