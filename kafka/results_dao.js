'use strict';

const {wordcount, sentiment, document} = require('./results_classes');
const { MongoClient, uri, dbname } = require('./db');

const { Kafka } = require('kafkajs');
const kafka = new Kafka ({
    clientId: 'nodeserver',
    brokers: ['kafka1:9092', 'kafka2:9092']
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'test-group' })


exports.getWordCount = function() {
    return new Promise((resolve, reject) => {

        MongoClient.connect(uri, function(err, db) {
            if (err) {
            	reject({msg: "error in db", details: err});
            	db.close();
            }
            
            var dbo = db.db(dbname);

            dbo.collection("wordcount").find({}).toArray(function(err, res) {
			    if (err) {
			    	reject({msg: "error in db", details: err})
			    	db.close();
			    }

			    resolve(res);

			    db.close();
			});
        });
    });
}

exports.insertTrainingDocuments = function(document) {
    return new Promise((resolve, reject) => {

        /*
        MongoClient.connect(uri, function(err, db) {
            if (err) {
                reject({msg: "error in db", details: err});
                db.close();
            }

            var dbo = db.db(dbname);

            dbo.collection("documents").insertOne(document, function(err, res) {
                if (err) {
                    reject({msg: "error in db", details: err});
                    db.close();
                }

                resolve(res);

                db.close();
            });
        });
        */

        const runProducer = async () => {
            await producer.connect();

            await producer.send({
                topic: 'training',
                messages: [
                    { value: document }
                ]
            });
            console.log("Message sent");

            await producer.disconnect();
        };

        runProducer();


        // TEST RECEIPT, INSERT IN DB

        const runConsumer = async () => {
            await consumer.connect();

            await consumer.subscribe({
                topic: 'training',
                fromBeginning: true
            });

            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    MongoClient.connect(uri, function(err, db) {
                        if (err) {
                            reject({msg: "error in db", details: err});
                            db.close();
                        }

                        var dbo = db.db(dbname);

                        dbo.collection("documents").insertOne(message, function(err, res) {
                            if (err) {
                                reject({msg: "error in db", details: err});
                                db.close();
                            }

                            resolve(res);

                            db.close();
                        });
                    });
                }
            });

            await consumer.disconnect();
        }

        runConsumer();

    });
}