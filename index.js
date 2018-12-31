const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const async = require('async');
const menus = require('./menus');
const menu_urls = require('./menu_urls');

// get information on the different menus and render index page
function displayIndex(req, res) {
    const reaktoriUrl = menu_urls.getReaktoriUrl();
    const hertsiUrl = menu_urls.getHertsiUrl();

    let tasks = {
            reaktoriMenu : function(callback){menus.getReaktoriMenu(reaktoriUrl, callback);},
            hertsiMenu : function(callback){menus.getHertsiMenu(hertsiUrl, callback);}
        };


     let done = function(err, results) {
         results.today = new Date().toDateString();
         res.render('pages/index', results);
     };

     // getting data and then rendering page
     // TODO use async.reflect
    async.parallel(tasks,done);
}


express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => displayIndex(req, res))
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));
