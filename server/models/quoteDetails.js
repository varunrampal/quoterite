const mongoose = require('mongoose');

var quoteDetailsSchema = new mongoose.Schema({

  id: {
    type: Number,
    required: false
  },
  user: {
    name: {
      type: String,
      required: false
    },
    email: {
      type: String,
      required: false
    },
    phone: {
      type: String,
      required: false
    }
  },
  property: {
    name: {
      type: String,
      required: false
    },
    email: {
      type: String,
      required: false
    },
    phone: {
      type: String,
      required: false
    },
    address: {
      type: {},
      required: false
    }
  },
  items: [{
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: false
    },
    price: {
      type: Number,
      required: false
    }

  }],
  notes: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: true
  },
  createDate: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true

  },
  transportType: {
    type: String,
    required: true

  },
  transportDate: {
    type: String,
    required: true
  }

});

const QuoteDetails = mongoose.model('QuoteDetails', quoteDetailsSchema);
exports.QuoteDetails = QuoteDetails;