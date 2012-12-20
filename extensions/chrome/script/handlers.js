/**
 * Name: handlers.js
 * Description: Background and popup page event handlers
 * Environment: Chrome
 * Version: 0.1
 */

function openOptionPage(callback) {
    chrome.tabs.create({
        url: './options.html'
    });
}

function sync(callbacks) {
    chrome.bookmarks.getTree(function(data) {
        userInfo.get(null, function(obj) {
            network.sync({
                bookmarks: data || '',
                uid: obj.uid || '',
                uniqueCode: obj.uniqueCode || ''
            }, callbacks);
        });
    });
}

function getAppName() {
    return 'Chrome';
}

var userInfo = new function() {
    var storage = chrome.storage.local;
    this.set = function(arg1, arg2) {
        storage.set(arg1, arg2);
    };
    this.get = function(arg1, arg2) {
        storage.get(arg1, arg2);
    };
    this.clear = function(arg1) {
        storage.clear(arg1);
    };
}();

chrome.bookmarks.onRemoved.addListener(function(id, obj) {
    console.log('onRemoved id is:' + id);
    console.log(obj);
});

chrome.bookmarks.onImportEnded.addListener(function() {
    console.log('importEnded');
});

chrome.bookmarks.onImportBegan.addListener(function() {
    console.log('importBegan');
});

chrome.bookmarks.onMoved.addListener(function(id, obj) {
    console.log('onMoved id is:' + id);
    console.log(obj);
});

chrome.bookmarks.onChanged.addListener(function(id, obj) {
    console.log('onChanged id is:' + id);
    console.log(obj);
});

chrome.bookmarks.onChildrenReordered.addListener(function(id, obj) {
    console.log('onChildrenReordered id is:' + id);
    console.log(obj);
});
