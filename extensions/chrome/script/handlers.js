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

function syncBookmarks(callback) {
    chrome.bookmarks.getTree(function(data) {
        network.sendBookmarks(data, callback);
    });
}

function getAppName() {
    return 'Chrome';
}

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
