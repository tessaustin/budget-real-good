let db;
const request = indexedDB.open('budget', 1);

// this event will emit if the database version changes
request.onupgradeneeded = function (event) {
    const db = event.target.results;
    db.createObjectStore('pending', { autoIncrement: true });
};

// upon a successful 
request.onsuccess = function (event) {
    db = event.target.result;

    // check if app is online
    if (navigator.onLine) {
        checkDatabase();
    }
};

request.onerror = function (event) {
    console.log(event.target.errorCode);
};

