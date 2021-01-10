'use strict';

const { MongoClient, uri, dbname } = require('./db');


exports.getWordCount = function() {
    return new Promise((resolve, reject) => {
        MongoClient.connect(uri, function(err, db) {
            if (err) {
                reject({msg: "error in db", details: err});
                // db.close(); db could be undefined
                console.log("could not connect to db");
                //return;
            }
            
            var dbo = db.db(dbname);

            dbo.collection("wordcount").find({}).sort({count:-1}).limit(100).toArray(function(err, res) {
			    if (err)
			    	reject({msg: "error in db", details: err})

			    resolve(res);

			    db.close();
			});
        });
    });
}

exports.getSentiment = function() {
    return new Promise((resolve, reject) => {
        MongoClient.connect(uri, function(err, db) {
            if (err) {
                reject({msg: "error in db", details: err});
                // db.close(); db could be undefined
                console.log("could not connect to db");
                //return;
            }
            
            var dbo = db.db(dbname);

            dbo.collection("sentiment").find({}).sort({_id:-1}).limit(100).toArray(function(err, res) {
			    if (err)
			    	reject({msg: "error in db", details: err})

			    resolve(res);

			    db.close();
			});
        });
    });
}

exports.getSentimentAccuracy = function() {
    return new Promise((resolve, reject) => {
        MongoClient.connect(uri, function(err, db) {
            if (err) {
                reject({msg: "error in db", details: err});
                // db.close(); db could be undefined
                console.log("could not connect to db");
                //return;
            }
            
            var dbo = db.db(dbname);

            dbo.collection("accuracy").find({}).sort({_id:-1}).limit(100).toArray(function(err, res) {
			    if (err)
			    	reject({msg: "error in db", details: err})

			    resolve(res);

			    db.close();
			});
        });
    });
}