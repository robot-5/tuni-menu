const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const async = require('async');
const menus = require('./menus')

// get information on the different menus and render index page
function displayIndex(req, res) {

    // TODO generate current urls of mensas
    const reaktoriUrl = 'https://www.fazerfoodco.fi/modules/json/json/Index?costNumber=0812&language=en';
    const hertsiUrl = 'https://www.sodexo.fi/ruokalistat/output/daily_json/12812/2018/12/11/en';

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
