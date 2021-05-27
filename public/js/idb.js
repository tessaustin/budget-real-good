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

function saveRecord(record) {
    // open a transaction on your pending db
    const transaction = db.transaction(['pending'], 'readwrite');
    // access your pending object store
    const store = transaction.objectStore('pending');
    // get all records from store and set to a variable
    const getAll = store.getAll();

    getAll.onsuccess = function () {
        // if there was data in indexedDb's store, let's send it to the api server
        if (getAll.result.length > 0) {
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(() => {
                    const transaction = db.transaction(['pending'], 'readwrite');
                    const store = transaction.objectStore('pending');
                    // clear all items in your store
                    store.clear();
                })
                .catch(err => {
                    console.log(err);
                });
        }
    };
}

// listen for app coming back online
window.addEventListener("online", checkDatabase);