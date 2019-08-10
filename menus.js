const request_promise_native = require('request-promise-native');
const parseXml = require('xml2js').parseString;


// return dish object with given parameters
//name and price should be string, ingredients should be array of strings
function dish(name, ingredients, price) {
    return {
        name: name,
        ingredients: ingredients,
        price: price
    };
}

// get menu of a restaurant and parse it with given parser
function getMenu(url, parseMenu) {

    return request_promise_native({ uri: url })
        .then(parseMenu)
        .catch((err) => console.log('error getting menu: ', err));
}


function parseReaktoriMenu(response_body) {
    response_body = JSON.parse(response_body);
    let reaktoriMenu = [];

    // response_body.MenusForDays[0] contains menu for current day
    if (!response_body || !response_body.hasOwnProperty('MenusForDays') || response_body.MenusForDays.length === 0 || !response_body.MenusForDays[0].hasOwnProperty('SetMenus')) {
        return reaktoriMenu;
    }

    for (let i = 0; i < response_body.MenusForDays[0].SetMenus.length; i++) {
        let setMenu = response_body.MenusForDays[0].SetMenus[i];
        reaktoriMenu.push(dish(setMenu.Name, setMenu.Components, setMenu.Price));
    }
    return reaktoriMenu;
}

function parseHertsiMenu(response_body) {
    response_body = JSON.parse(response_body);
    let hertsiMenu = [];

    if (!response_body.hasOwnProperty('courses')) {
        return hertsiMenu;
    }

    for (let i = 0; i < response_body.courses.length; i++) {
        let course = response_body.courses[i];
        hertsiMenu.push(dish(course.category, [course.title_en], course.price));
    }
    return hertsiMenu;
}

function parseYoRavintolaMenu(response_body) {

    //the API returns JSON wrapped in XML...
    parseXml(response_body, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            response_body = JSON.parse(result.string._);
        }
    });

    let yoRavintolaMenu = [];
    if (!response_body || !response_body.hasOwnProperty('MealOptions')) {
        return yoRavintolaMenu;
    }

    for (let mealOption of response_body.MealOptions) {
        
        if (mealOption.Name == "[CLOSED]") {
            continue;
        }

        let ingredients = mealOption.MenuItems.map(m => m.Name_EN);
        //the API reports wrong prices (compared to offical page), set price to null (for now)
        yoRavintolaMenu.push(dish(mealOption.Name_EN, ingredients, null));
    }
    console.log(yoRavintolaMenu);
    return yoRavintolaMenu;
}

// get menu of restaurant Minerva on Tampere Campus
function getMinervaMenu() {
    let url = 'https://www.fazerfoodco.fi/modules/json/json/Index?costNumber=0815&language=en';
    //using parser of Reaktori since both have same JSON structure
    return getMenu(url, parseReaktoriMenu);
}

// get menu of restaurant Reaktori on Hervanta Campus
function getReaktoriMenu() {
    let url = 'https://www.fazerfoodco.fi/modules/json/json/Index?costNumber=0812&language=en';
    return getMenu(url, parseReaktoriMenu);
}

// get menu of restaurant Hertsi on Hervanta Campus
function getHertsiMenu() {
    let today = new Date();
    let dateString = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;
    let url = `https://www.sodexo.fi/ruokalistat/output/daily_json/12812/${dateString}/en`;
    return getMenu(url, parseHertsiMenu);
}

// get menu of restaurant Juvenes Yliopiston Ravintola on Tampere Campus
function getYoRavintolaMenu() {

    const today = new Date();
    let url = 'http://www.juvenes.fi/DesktopModules/Talents.LunchMenu/LunchMenuServices.asmx/GetMenuByDate?';
    let query = `KitchenId=13&MenuTypeId=60&Date=${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}&lang=en`;
    url += query;
    console.log(url);
    return getMenu(url, parseYoRavintolaMenu);
}

// get and return information on the different menus
function getAllMenus() {
    //turns array of menus into object of menus
    function assembleMenus(arr) {
        return {
            today: (new Date()).toDateString(),
            yoRavintolaMenu: arr[0],
            minervaMenu: arr[1],
            reaktoriMenu: arr[2],
            hertsiMenu: arr[3],
        };
    }

    return Promise.all(
        [getYoRavintolaMenu(),
        getMinervaMenu(),
        getReaktoriMenu(),
        getHertsiMenu()
        ])
        .then(assembleMenus)
        .catch(error => console.log('error while waiting for all menus: ', error));
}

module.exports  = {
    getYoRavintolaMenu: getYoRavintolaMenu,
    getMinervaMenu: getMinervaMenu,
    getReaktoriMenu: getReaktoriMenu,
    getHertsiMenu: getHertsiMenu,
    getAllMenus: getAllMenus,
};
