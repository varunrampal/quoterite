const mongoose = require('mongoose');
const autoIncrement = require('mongoose-plugin-autoinc');

var quoteSchema = new mongoose.Schema({

  id: {
    type: Number,
    required: false
   },
    submitedBy: {
        type: String,
        required:true
    },
    property:{
      type: String,
      required:false
    },
   items:[{
          id:{
            type: Number,
            required: true,
          },
          name:{
            type: String,
            required: true,
          },
          quantity:{
            type: Number,
            required: true,
          }
   }],
   notes:{
       type: String,
       required: false,
   },
   type:{
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

quoteSchema.plugin(autoIncrement.plugin, {
    model: 'Quote',
    field: 'id',
    startAt: 100,
    incrementBy: 1,
});

const Quote = mongoose.model('Quote', quoteSchema);
exports.Quote = Quote;
