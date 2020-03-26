require('dotenv').config();
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const uuid4 = require('uuid/v4');

const config = require('./config');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cors());

app.get('/', (req, res, next) => {
  res.json({ user: "Joshua Gato" });
});

const uuid = uuid4();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'product_pictures');
  },
  filename: (req, file, cb) => {
    cb(null, uuid + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg')
    cb(null, true);
  else
    cb(null, false);
}

// Making the product_pictures folder accessible
app.use('/product_pictures', express.static(path.join(__dirname, 'product_pictures')));
app.use(multer({ storage: storage, fileFilter: fileFilter }).single('product_picture'));


mongoose.connect(process.env.PORT || config.database, err => {
  if (err) console.log(err);
  else console.log("Connected to the database");
});


const mainRoutes = require('./routes/main');
const userRoutes = require('./routes/account');
const sellerRoutes = require('./routes/seller');

app.use('/api', mainRoutes);
app.use('/api/accounts', userRoutes);
app.use('/api/seller', sellerRoutes);

app.listen(config.port, err => {
  console.log('Magic happens on port ' + config.port);
});
