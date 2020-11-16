'use strict';

const {wordcount, sentiment, document} = require('./results_classes');
const { MongoClient, uri, dbname } = require('./db');

const { Kafka } = require('kafkajs');

const kafka = new Kafka ({
    clientId: 'nodeserver',
    brokers: [process.env.KAFKA_HOST + ':9092']
});

// create kafka topics
const startup  = async () => {
    const admin = kafka.admin();
    await admin.connect();
    await admin.createTopics({
        topics: [{
            topic: 'training',
            numPartitions: 2,
            replicationFactor: 1
        }
        ],
});
    await admin.disconnect();
};

startup().then(() => console.log('topics created!'));


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

            dbo.collection("documents").find({}).toArray(function(err, res) {
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
                    { value: document.text }
                ]
            })

            //await producer.disconnect();
        };

        runProducer().then(() => console.log('message sent, awaiting receipt...'));


        // TEST RECEIPT, INSERT IN DB

        const runConsumer = async () => {
            await consumer.connect();

            await consumer.subscribe({
                topic: 'training',
                fromBeginning: true
            })
            .then(console.log('consumer connected'));

            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log('received message ', message);

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

            //await consumer.disconnect();
        }

        runConsumer();

    });
}