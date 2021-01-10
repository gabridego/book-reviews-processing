var kafka = require('kafka-node'),
//client = new kafka.KafkaClient({kafkaHost: 'localhost:9092'}),
client = new kafka.KafkaClient({kafkaHost: 'kafkaa:9092'}),
producer = new kafka.Producer(client);

var topicSpark = "quickstart-events";

producer.on('ready', function () {
    console.log("kafka is ready");

    client.createTopics([{topic: topicSpark, partitions: 1, replicationFactor: 1}], (error, result) => {
        // result is an array of any errors if a given topic could not be created
        console.log(error, result);
    });
});
producer.on('error', function (err) {
    console.log("error: " +  err)
;})



exports.sendSpark = function(message) {
    var payloads = [
        { topic: topicSpark, messages: message},
    ];
    producer.send(payloads, function (err, data) {
        console.log(data);
    });
}