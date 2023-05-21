'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/indexController')


router.get('/', controller.showHomepage);

router.get('/:page', controller.showPage);

// router.get('/cart', (req, res) => {
//     res.render('cart');
// });

// router.get('/checkout', (req, res) => {
//     res.render('checkout');
// });

// router.get('/contact', (req, res) => {
//     res.render('contact');
// });

// router.get('/login', (req, res) => {
//     res.render('login');
// });

// router.get('/my-account', (req, res) => {
//     res.render('my-account');
// });

// router.get('/product-detail', (req, res) => {
//     res.render('product-detail');
// });

// router.get('/product-list', (req, res) => {
//     res.render('product-list');
// });

// router.get('/wishlist', (req, res) => {
//     res.render('wishlist');
// });

module.exports = router;