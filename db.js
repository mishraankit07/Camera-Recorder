// this file contains all code related to database transactions
let db;

console.log("db file linked!");

// tries to open a connection with a database
// second argument is the version of the database
let dbOpenRequest = indexedDB.open("gallery", 1);

// when db is created, or its version is upgraded
// then this method is called
dbOpenRequest.addEventListener("upgradeneeded", function (e) {
    console.log("db upgraded");
    
    // get the access of the database 
    db = dbOpenRequest.result;

    // object store can only be created in upgradeneeded
    // object stores are basically tables where data is stored
    // keypath specifies which item uniquely identifies each entry i.e primary key
    
    db.createObjectStore("videos", { keyPath: "id" });
    db.createObjectStore("images", { keyPath: "id" });
});

dbOpenRequest.addEventListener("success", function (e) {
    console.log("db open succesful");
    
    // if db is only reloaded and not newly created then onupgrade not called
    // so need to assign it here as well
    db = dbOpenRequest.result;
});

dbOpenRequest.addEventListener("error", function (e) {
    console.log("db open failure");
});