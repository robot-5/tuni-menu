const request = require('request');
const async = require('async');
const menu_urls = require('./menu_urls');
const htmlparser = require('htmlparser');

// return dish object with given parameters
function dish(name, ingredients, price) {
    return {
        name: name,
        ingredients: ingredients,
        price: price
    };
}

// get menu of a restaurant and parse it with given parser
function getMenu(url, callback, parseMenu) {
    //callback for request for menu
    request_callback = (error, response, body) => {
        if (error) {
            console.log(error);
            callback(error, null);
        } else {
            //final callback
            callback(null, parseMenu(body));
        }
    };

    //send request, process response
    request(url, {json: true}, request_callback);
}


function parseReaktoriMenu(response_body) {
    let reaktoriMenu = [];

    // response_body.MenusForDays[0] contains menu for current day
    if (response_body.MenusForDays.length === 0 || ! response_body.MenusForDays[0].hasOwnProperty('SetMenus')) {
        return reaktoriMenu;
    }

    for (let i = 0; i < response_body.MenusForDays[0].SetMenus.length; i++) {
        let curr_dish = response_body.MenusForDays[0].SetMenus[i];
        reaktoriMenu.push(dish(curr_dish.Name, curr_dish.Components, curr_dish.Price));
    }
    return reaktoriMenu;
}

function parseHertsiMenu(response_body) {
    let hertsiMenu = [];

    if (! response_body.hasOwnProperty('courses')) {
        return reaktoriMenu;
    }

    for (let i = 0; i < response_body.courses.length; i++) {
        let curr_dish = response_body.courses[i];
        hertsiMenu.push(dish(curr_dish.category,[curr_dish.title_en], curr_dish.price));
    }
    return hertsiMenu;
}

function parseYoRavintolaMenu(response_body) {
    let yoRavintolaMenu = [];
    // TODO parse JSON
    if (! response_body.hasOwnProperty('MealOptions')) {
        return yoRavintolaMenu;
    }

    return yoRavintolaMenu;
}

// get menu of restaurant Minerva on Tampere Campus
function getMinervaMenu(url, callback) {
    //using parser of Reaktori since both have same JSON structure
    getMenu(url,callback,parseReaktoriMenu);
}

// get menu of restaurant Reaktori on Hervanta Campus
function getReaktoriMenu(url, callback) {
    getMenu(url,callback,parseReaktoriMenu);
}

// get menu of restaurant Hertsi on Hervanta Campus
function getHertsiMenu(url, callback) {
    getMenu(url,callback,parseHertsiMenu);
}

// get menu of restaurant Juvenes Yliopiston Ravintola on Tampere Campus
function getYoRavintolaMenu(url, callback) {
    getMenu(url,callback,parseYoRavintolaMenu);
}

// get information on the different menus and output via 'done' function
// done must take two parameters err and results
function getAllMenus(req, res, done) {
    const minervaUrl = menu_urls.getMinervaUrl();
    const reaktoriUrl = menu_urls.getReaktoriUrl();
    const hertsiUrl = menu_urls.getHertsiUrl();
    const yoRavintolaUrl = menu_urls.getYoRavintolaUrl();


    let tasks = {
            //Tampere campus
            yoRavintolaMenu : function(callback){getYoRavintolaMenu(yoRavintolaUrl, callback);},
            minervaMenu : function(callback){getMinervaMenu(minervaUrl, callback);},
            //Hervanta Campus
            reaktoriMenu : function(callback){getReaktoriMenu(reaktoriUrl, callback);},
            hertsiMenu : function(callback){getHertsiMenu(hertsiUrl, callback);},
            //current date as string
            today : function(callback) {callback(null, (new Date()).toDateString());},
        };

     // getting data and then rendering page
     // TODO use async.reflect
    async.parallel(tasks,done);
}



var menuGetters = {
    getYoRavintolaMenu : getYoRavintolaMenu,
    getMinervaMenu: getMinervaMenu,
    getReaktoriMenu: getReaktoriMenu,
    getHertsiMenu: getHertsiMenu,
    getAllMenus: getAllMenus,
};
module.exports = menuGetters;
