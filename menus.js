const request_promise_native = require('request-promise-native');
const menu_urls = require('./menu_urls');

// return dish object with given parameters
function dish(name, ingredients, price) {
    return {
        name: name,
        ingredients: ingredients,
        price: price
    };
}

// get menu of a restaurant and parse it with given parser
function getMenu(url, parseMenu) {

    return request_promise_native({ uri: url, json: true })
        .then(parseMenu)
        .catch((err) => console.log('error getting menu: ', err));
}


function parseReaktoriMenu(response_body) {
    let reaktoriMenu = [];

    // response_body.MenusForDays[0] contains menu for current day
    if (!response_body || !response_body.hasOwnProperty('MenusForDays') || response_body.MenusForDays.length === 0 || !response_body.MenusForDays[0].hasOwnProperty('SetMenus')) {
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

    if (!response_body.hasOwnProperty('courses')) {
        return hertsiMenu;
    }

    for (let i = 0; i < response_body.courses.length; i++) {
        let curr_dish = response_body.courses[i];
        hertsiMenu.push(dish(curr_dish.category, [curr_dish.title_en], curr_dish.price));
    }
    return hertsiMenu;
}

function parseYoRavintolaMenu(response_body) {
    let yoRavintolaMenu = [];
    // TODO parse JSON
    if (!response_body || !response_body.hasOwnProperty('MealOptions')) {
        return yoRavintolaMenu;
    }

    return yoRavintolaMenu;
}

// get menu of restaurant Minerva on Tampere Campus
function getMinervaMenu(url) {
    //using parser of Reaktori since both have same JSON structure
    return getMenu(url, parseReaktoriMenu);
}

// get menu of restaurant Reaktori on Hervanta Campus
function getReaktoriMenu(url) {
    return getMenu(url, parseReaktoriMenu);
}

// get menu of restaurant Hertsi on Hervanta Campus
function getHertsiMenu(url) {
    return getMenu(url, parseHertsiMenu);
}

// get menu of restaurant Juvenes Yliopiston Ravintola on Tampere Campus
function getYoRavintolaMenu(url) {
    return getMenu(url, parseYoRavintolaMenu);
}

// get information on the different menus and output via 'done' function
// done must take two parameters err and results
function getAllMenus() {
    const minervaUrl = menu_urls.getMinervaUrl();
    const reaktoriUrl = menu_urls.getReaktoriUrl();
    const hertsiUrl = menu_urls.getHertsiUrl();
    const yoRavintolaUrl = menu_urls.getYoRavintolaUrl();

    //turns array of menus into object of menus
    function assembleMenus(arr) {
        let results = {
            today: (new Date()).toDateString(),
        };
        results.yoRavintolaMenu = arr[0];
        results.minervaMenu = arr[1];
        results.reaktoriMenu = arr[2];
        results.hertsiMenu = arr[3];
        return results;
    }

    return Promise.all(
        [getYoRavintolaMenu(yoRavintolaUrl),
        getMinervaMenu(minervaUrl),
        getReaktoriMenu(reaktoriUrl),
        getHertsiMenu(hertsiUrl)
        ])
        .then(assembleMenus)
        .catch(error => console.log('error while waiting for all menus: ', error));
}

const menuGetters = {
    getYoRavintolaMenu: getYoRavintolaMenu,
    getMinervaMenu: getMinervaMenu,
    getReaktoriMenu: getReaktoriMenu,
    getHertsiMenu: getHertsiMenu,
    getAllMenus: getAllMenus,
};
module.exports = menuGetters;
