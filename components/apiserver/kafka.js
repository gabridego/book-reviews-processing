var kafka = require('kafka-node'),
//client = new kafka.KafkaClient({kafkaHost: 'kafkaa:9092'}),
client = new kafka.KafkaClient({kafkaHost: 'localhost:9092'}),
producer = new kafka.Producer(client);

var topicSpark = "quickstart-events";

producer.on('ready', function () {
    console.log("it is ready");
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