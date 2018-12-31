

// get Reaktori URL for current week
function getReaktoriUrl() {
    return 'https://www.fazerfoodco.fi/modules/json/json/Index?costNumber=0812&language=en';
}

// get Hertsi URL for current day
function getHertsiUrl() {
    const today = new Date();
    const dateString = today.getFullYear() + '/' + (today.getMonth()+1) + '/' + today.getDate();
    return 'https://www.sodexo.fi/ruokalistat/output/daily_json/12812/' + dateString + '/en';
}


var urlGetters = {
    getReaktoriUrl: getReaktoriUrl,
    getHertsiUrl: getHertsiUrl
};
module.exports = urlGetters;
