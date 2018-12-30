const express = require('express');
const path = require('path');
// const bootstrap = require('bootstrap');
const PORT = process.env.PORT || 5000;
const request = require('request');
const async = require("async");

// get menu of restaurant Reaktori on Hervanta Campus
function getReaktoriMenu(url, callback) {
    request(url, {
            json: true
        },
        (error, response, body) => {
            // todo think about error handling
            if (error) {
                console.log(error);
                callback(error,null);
            }
            let reaktoriMenu = [];
            for (let i in body.MenusForDays[0].SetMenus) {
                let dish = body.MenusForDays[0].SetMenus[i]
                reaktoriMenu.push([dish.Name, dish.Components]);
            }
            callback(null,reaktoriMenu);
        }
    );
}



// get information on the different menus and render index page
function displayIndex(req, res) {

    // todo generate current urls of mensas
    const reaktoriUrl = 'https://www.fazerfoodco.fi/modules/json/json/Index?costNumber=0812&language=en';

    let tasks = {
            reaktoriMenu: function(callback){getReaktoriMenu(reaktoriUrl, callback);}
        };


     let done = function(err, results) {
         results.today = new Date().toDateString();
         res.render('pages/index', results);
     };

     // getting data and then rendering page
     // TODO write better code here
     // TODO use async.reflect
    async.parallel(tasks,done);
}


express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => displayIndex(req, res))
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));
