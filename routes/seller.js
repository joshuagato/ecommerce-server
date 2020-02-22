const router = require('express').Router();
const Product = require('../models/product');

const checkJWT = require('../middlewares/check-jwt');

router.route('/products')
.get(checkJWT, (req, res, next) => {
    Product.find({ owner: req.decoded.user._id })
    .populate('owner').populate('category').exec((err, products) => {
        if (products) res.json({ success: true, message: 'Products', products: products });
    })
})
.post(checkJWT, (req, res, next) => {
    let product = new Product();

    product.owner = req.decoded.user._id;
    product.category = req.body.categoryId;
    product.title = req.body.price;
    product.price = req.body.price;
    product.description = req.body.description;
    product.image = req.file.path;
    product.save();

    res.json({ success: true, message: 'Successfully added the product.' });
});

module.exports = router;
