const router = require('express').Router();
const async = require('async');

const Category = require('../models/category');
const Product = require('../models/product');

router.route('/categories')
.get((req, res, next) => {
  Category.find({}, (err, categories) => {
    res.json({ success: true, message: 'Successful.', categories: categories })
  })
})
.post((req,res, next) => {
  let category = new Category();

  category.name = req.body.category;
  category.save();

  res.json({ success: true, message: 'Successful added new category.' });
});


router.get('/categories/:id', (req, res, next) => {
  const perPage = 10;
  const page = req.query.page;

  async.parallel([
    function(callback) {
      Product.count({ category: req.params.id }, (err, count) => {
        const totalProducts = count;
        callback(err, totalProducts);
      });
    },
    function(callback) {
      Product.find({ category: req.params.id }).skip(perPage * page).limit(perPage)
      .populate('category').populate('owner').exec((err, products) => {
        if (err) return next(err);
        callback(err, products);
      });
    },
    function(callback) {
      Category.findOne({ _id: req.params.id }, (err, category) => {
        callback(err, category);
      });
    }
  ],
  function(err, results) {
    const totalProducts = results[0];
    const products = results[1];
    const category = results[2];

    res.json({
      success: true, message: 'category', products: products, categoryName: category.name,
      totalProducts: totalProducts, pages: Math.ceil(totalProducts / perPage)
    });
  });
});


router.get('/products', (req, res, next) => {
  const perPage = 10;
  const page = req.query.page;

  async.parallel([
    function(callback) {
      Product.count({}, (err, count) => {
        const totalProducts = count;
        callback(err, totalProducts);
      });
    },
    function(callback) {
      Product.find({}).skip(perPage * page).limit(perPage)
      .populate('category').populate('owner').exec((err, products) => {
        if (err) return next(err);
        callback(err, products);
      });
    }
  ],
  function(err, results) {
    const totalProducts = results[0];
    const products = results[1];

    res.json({
      success: true, message: 'category', products: products,
      totalProducts: totalProducts, pages: Math.ceil(totalProducts / perPage)
    });
  });
});

router.get('/product/:id', (req, res, next) => {
  Product.findById({ _id: req.params.id }).populate('category').populate('owner')
  .exec((err, product) => {
    if (err) res.json({ success: false, message: 'Product not found.' });
    else {
      if (product) res.json({ success: true, product: product });
    }
  })
})

module.exports = router;
