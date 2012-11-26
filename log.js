var typeStr = ['INFO   ', 'ERROR  ', 'WARNING', 'DEBUG  '];

exports.types = {
    INFO : 0,
    ERROR : 1,
    WARNING : 2,
    DEBUG : 3
}

exports.log = function(type, text) {
    var log = '';
    
    if (!text) {
        text = type;
        type = 0;
    }

    log = getTime() + '[' + typeStr[type] + '] ' + text;

    console.log(log);
}

function getTime() {
    var date = new Date(),
    year = date.getFullYear(),
    month = date.getMonth() + 1,
    day = date.getDate(),
    hour = date.getHours(),
    minute = date.getMinutes(),
    second = date.getSeconds();

    return year + '-' + to2(month) + '-' + to2(day) + ' ' +
        to2(hour) + ':' + to2(minute) + ':' + to2(second) + ' ';
}

function to2(num) {
    return num > 9 ? num : '0' + num;
}
