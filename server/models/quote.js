const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-plugin-autoinc');

var quoteSchema = new mongoose.Schema({

  id: {
    type: Number,
    required: false
   },
    submitedBy: {
        type: Schema.Types.ObjectId, ref: 'User',
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
   },
   user: {
     type: [],
     required: false

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
