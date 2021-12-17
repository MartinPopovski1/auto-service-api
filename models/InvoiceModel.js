const mongoose = require('mongoose')
const AutoPartSchema = require('./autoPartModel').AutoPartSchema

const {Schema} = mongoose;
const InvoiceSchema = new Schema(
    {
        invoiceDocumentType: {type: String},
        invoiceNumber: {type: String},
        owner: {type: String},
        emb: {type: String},
        address: {type: String},
        contact: {type: String},
        date: {type: String},

        registrationNumber: {type: String},
        brand: {type: String},
        type: {type: String},
        manufacturingYear: {type: String},
        engineNumber: {type: String},
        chassisNumber: {type: String},
        kw: {type: String},
        km: {type: String},

        autoPartsFromStock: [{
            name: {type: String},
            quantity: {type: String},
            purchasePrice: {type: String},
            totalPrice: {type: String},
        }],
        autoPartsOutOfStock: [{
            name: {type: String},
            quantity: {type: String},
            purchasePrice: {type: String},
            totalPrice: {type: String},
        }],

        labour: {type: String},
        totalPrice: {type: String}
    });


module.exports = mongoose.model('Invoice', InvoiceSchema)
