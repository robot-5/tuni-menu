const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const menus = require('./menus');

// get information on the different menus and render index page
function allMenusHtml(req, res) {

    let done = function (err, results) {
        res.render('pages/index', results);
    };
    menus.getAllMenus(req, res, done);
}

// get information on the different menus and return as JSON
function allMenusJson(req, res) {

    let done = function (err, results) {
        res.json(results);
    };
    menus.getAllMenus(req, res, done);
}

express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => allMenusHtml(req, res))
    .get('/json', (req, res) => allMenusJson(req, res))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));
