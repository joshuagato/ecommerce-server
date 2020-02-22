const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    title: String,
    price: Number,
    image: String,
    description: String,
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
