const request = require('request');
const htmlparser = require('htmlparser');

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
                let dish = body.MenusForDays[0].SetMenus[i];
                reaktoriMenu.push([dish.Name, dish.Components]);
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
                let dish = body.courses[i];
                hertsiMenu.push([dish.category, [dish.title_en]]);
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
