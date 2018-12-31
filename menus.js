const request = require('request');
const htmlparser = require('htmlparser');

// return dish object with given parameters
function dish(name, ingredients, price) {
    return {
        name: name,
        ingredients: ingredients,
        price: price
    };
}

// get menu of restaurant Reaktori on Hervanta Campus
function getReaktoriMenu(url, callback) {
    //callback for request for menu
    request_callback = (error, response, body) => {
        if (error) {
            console.log(error);
            callback(error, null);
        } else {
            let reaktoriMenu = [];
            for (let i in body.MenusForDays[0].SetMenus) {
                let curr_dish = body.MenusForDays[0].SetMenus[i];
                reaktoriMenu.push(dish(curr_dish.Name, curr_dish.Components, curr_dish.Price));
            }
            callback(null, reaktoriMenu);
        }
    };

    //send request, process response
    request(url, {json: true}, request_callback);
}

// get menu of restaurant Hertsi on Hervanta Campus
function getHertsiMenu(url, callback) {
    //callback for request for menu
    request_callback = (error, response, body) => {
        if (error) {
            console.log(error);
            callback(error, null);
        } else {
            let hertsiMenu = [];

            for (let i in body.courses) {
                let curr_dish = body.courses[i];
                hertsiMenu.push(dish(curr_dish.category,[curr_dish.title_en], curr_dish.price))
            }
            callback(null, hertsiMenu);
        }
    };

    //send request, process response
    request(url, {json: true}, request_callback);
}



var menuGetters = {
    getReaktoriMenu: getReaktoriMenu,
    getHertsiMenu: getHertsiMenu
};
module.exports = menuGetters;
