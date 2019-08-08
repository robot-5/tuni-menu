


// get Minerva URL for current week
function getMinervaUrl() {
    return 'https://www.fazerfoodco.fi/modules/json/json/Index?costNumber=0815&language=en';
}

// get Reaktori URL for current week
function getReaktoriUrl() {
    return 'https://www.fazerfoodco.fi/modules/json/json/Index?costNumber=0812&language=en';
}

// get Hertsi URL for current day
function getHertsiUrl() {
    const today = new Date();
    const dateString = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
    return 'https://www.sodexo.fi/ruokalistat/output/daily_json/12812/' + dateString + '/en';
}

// get Juvenes YoRavintola URL for current day
function getYoRavintolaUrl() {
    const today = new Date();
    const baseUrl = 'http://www.juvenes.fi/DesktopModules/Talents.LunchMenu/LunchMenuServices.asmx/GetMenuByDate?';
    const kitchenID = 'KitchenId=13';
    const menuTypeId = 'MenuTypeId=60';
    const dateString = 'Date=' + [today.getDate(), today.getMonth() + 1, today.getFullYear()].join('/');
    const lang = 'lang=en';
    const query = [kitchenID, menuTypeId, dateString, lang].join('&');
    return baseUrl + query;
}


const urlGetters = {
    getReaktoriUrl: getReaktoriUrl,
    getHertsiUrl: getHertsiUrl,
    getMinervaUrl: getMinervaUrl,
    getYoRavintolaUrl: getYoRavintolaUrl
};
module.exports = urlGetters;
