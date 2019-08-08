const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const menus = require('./menus');


// get information on the different menus and render index page
function allMenusHtml(req, res) {

    menus.getAllMenus()
        .then((results) => res.render('pages/index', results))
        .catch(err => {
            console.log('error in allMenusHtml: ', err);
            res.send('There was an error, sorry!')
        });
}

// get information on the different menus and return as JSON
function allMenusJson(req, res) {

    menus.getAllMenus()
        .then((results) => res.json(results))
        .catch(err => {
            console.log('error in allMenusJson: ', err);
            res.send('There was an error, sorry!')
        });
}

express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', allMenusHtml)
    .get('/json', allMenusJson)
    .listen(PORT, () => console.log(`Listening on ${PORT}`));
