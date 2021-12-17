const mongoose = require('mongoose')

const {Schema} = mongoose;
 const autoPartSchema = new Schema(
     {
         name: {type:String},
         brand: {type:String},
         quantity: {type:String},
         purchasePrice: {type:String},
     });

 module.exports = {
     AutoPartModel: mongoose.model('AutoPart', autoPartSchema),
     AutoPartSchema: autoPartSchema
 }
