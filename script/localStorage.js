const STORAGE_BOOK_KEY = "storage-book";
const HISTORY_KEY = "history-book";



function loadDataFromStorage() {
    return {
        storageBook : JSON.parse(localStorage.getItem(STORAGE_BOOK_KEY)),
        storageHistory : JSON.parse(localStorage.getItem(HISTORY_KEY)),
    }
};

function isLocalStorageExist() {
    return typeof (Storage) != "undefined" ? true : false;
}

function isKeyStorageExist(key) {
    return localStorage.getItem(key) ? true : false;
}