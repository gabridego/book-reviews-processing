'use strict';

const {wordcount, sentiment, document} = require('./results_classes');
const { MongoClient, uri, dbname } = require('./db');


exports.getWordCount = function() {
    return new Promise((resolve, reject) => {
        MongoClient.connect(uri, function(err, db) {
            if (err) {
                reject({msg: "error in db", details: err});
                db.close();
            }
            
            var dbo = db.db(dbname);

            dbo.collection("wordcount").find({}).toArray(function(err, res) {
			    if (err)
			    	reject({msg: "error in db", details: err})

                //let result = res.map((row) => new wordcount(row.id, row.word, row.counter)); 
                //resolve(result);
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
                db.close();
            }
            
            var dbo = db.db(dbname);

            dbo.collection("sentiment").find({}).toArray(function(err, res) {
			    if (err)
			    	reject({msg: "error in db", details: err})

                //let result = res.map((row) => new sentiment(row.id, row.document_id, row.returned_result, row.expected_result)); 
                //resolve(result);
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
                db.close();
            }
            
            var dbo = db.db(dbname);

            dbo.collection("accuracy").find({}).toArray(function(err, res) {
			    if (err)
			    	reject({msg: "error in db", details: err})

                //let result = res.map((row) => new sentiment(row.id, row.text)); 
                //resolve(result);
			    resolve(res);

			    db.close();
			});
        });
    });
}

exports.insertTrainingDocuments = function(document) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(uri, function(err, db) {
            if (err) {
                reject({msg: "error in db", details: err});
                db.close();
            }
            var dbo = db.db(dbname);
            dbo.collection("documents").insertOne(document, function(err, res) {
                if (err) 
                    reject({msg: "error in db", details: err});
                resolve(res.insertedId);
                db.close();
            });
        });
    });
}

exports.insertTestDocuments = function(document) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(uri, function(err, db) {
            if (err) {
                reject({msg: "error in db", details: err});
                db.close();
            }
            var dbo = db.db(dbname);
            dbo.collection("documents").insertOne(document, function(err, res) {
                if (err) 
                    reject({msg: "error in db", details: err});
                resolve(res.insertedId);
                db.close();
            });
        });
    });
}


//actually I delete all documents
exports.deleteResults = function() {
    return new Promise((resolve, reject) => {
        MongoClient.connect(uri, function(err, db) {
            if (err) {
                reject({msg: "error in db", details: err});
                db.close();
            }
            var dbo = db.db(dbname);
            dbo.collection("documents").drop(function(err, delOK) {
                if (err) 
                    reject({msg: "error in db", details: err});
                resolve();
                db.close();
            });
        });
    });
}