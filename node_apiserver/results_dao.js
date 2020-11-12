'use strict';

const {wordcount, sentiment, document} = require('./results_classes');
const { MongoClient, uri, dbname } = require('./db');


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

        MongoClient.connect(uri, function(err, db) {
            if (err)
            	reject({msg: "error in db", details: err});
            
            var dbo = db.db(dbname);

            dbo.collection("documents").find({}).toArray(function(err, res) {
			    if (err)
			    	reject({msg: "error in db", details: err})

			    resolve(res);

			    db.close();
			});
        });
    });
}

exports.insertTrainingDocuments = function(document) {
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

        MongoClient.connect(url, function(err, db) {
            if (err) 
                reject({msg: "error in db", details: err});
            var dbo = db.db(dbname);
            var myobj = { name: "Company Inc", address: "Highway 37" };
            dbo.collection("customers").insertOne(document, function(err, res) {
                if (err) 
                    reject({msg: "error in db", details: err});
                resolve(res);
                db.close();
            });
        });
    });
}