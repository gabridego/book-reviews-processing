'use strict';

const {wordcount, sentiment, document} = require('./results_classes');
const client = require('./db');


exports.getWordCount = function() {
    return new Promise((resolve, reject) => {
        /*const sql = "SELECT id, name FROM categories;";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject({msg: "error in db", details: err});
            } else {
                let categories = rows.map((row) => createCategory(row));
                resolve(categories);
            }
        });*/

        resolve({id: 1});
    });
}