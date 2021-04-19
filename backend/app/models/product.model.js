const mongoose = require('mongoose');

const Productschema = mongoose.Schema({
   code: Number,
   author: String,
   barcode: String,
   status: String,
   imported_t: Date,
   url: String,
   product_name: String,
   quantity: String,
   categories: String,
   packaging: String,
   brands: String,
   image_url: String,
}, {
   timestamps: true
});

module.exports = mongoose.model('Product', Productschema);
