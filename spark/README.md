## To compile spark application
`sbt package` for running local, `sbt assembly` for building a fat jar.

## To test locally
Run the db:
`sudo docker run --name mymongo -p 27017:27017 -d mongo`

Create a Kafka topic named `quickstart-events` following the instructions [here](https://kafka.apache.org/quickstart) (`bin/zookeeper-server-start.sh config/zookeeper.properties` -> `bin/kafka-server-start.sh config/server.properties` -> `bin/kafka-topics.sh --create --topic quickstart-events --bootstrap-server localhost:9092`, `bin/kafka-console-producer.sh --topic quickstart-events --bootstrap-server localhost:9092`)

### Wordcounter
Locally submit wordcount job (must have spark installed):

`$SPARK_HOME/bin/spark-submit --class fr.ensimag.sdtd.WordCounter --packages org.apache.spark:spark-sql-kafka-0-10_2.12:3.0.1,org.mongodb.spark:mongo-spark-connector_2.12:3.0.0 $PATH_TO_PROJECT/spark/wordcount/target/scala-2.12/wordcounter_2.12-1.0.jar`

Start writing reviews in the Kafka producer terminal, with the format `{"reviewText": "<text>", "overall": 2.0}`.

To explore the results, `sudo docker exec -it mymongo mongo` to enter the mongodb shell. Then `use sdtd` to switch to our db, and `db.wordcounts.find()`

### Sentiment analysis
A random forest classifier is trained on local data, looking for the best values for the number of trees and for the maximum depth. A JSON file containing the training data in the format `{"reviewText": "<text>", "overall": 2.0}`, one review per line, must be provided as first argument to the program. The trained model is saved in the `$PATH_TO_PROJECT/spark/sentiment/model` directory.

To start the training: `SPARK_HOME/bin/spark-submit --class fr.ensimag.sdtd.SentimentTrain $PATH_TO_PROJECT/spark/sentiment/train/target/scala-2.12/sentimenttrain_2.12-1.0.jar <file.json>`

The model is then loaded by another job which applies it to streaming data. The received reviews are stored in mongodb with real and predicted label. The number of test reviews and the prediction accuracy are updated at each minibatch and stored in the collection `accuracy` .

To test the model: `SPARK_HOME/bin/spark-submit --class fr.ensimag.sdtd.SentimentTest --packages org.apache.spark:spark-sql-kafka-0-10_2.12:3.0.1,org.mongodb.spark:mongo-spark-connector_2.12:3.0.0 $PATH_TO_PROJECT/spark/sentiment/test/target/scala-2.12/sentimenttest_2.12-1.0.jar` and write in the kafka producer console, same format as before.

From the mongodb shell, explore the results with `db.sentiment.find()` and `db.accuracy.find()`

## To test on k8s
Create k8s secret:
`kubectl create secret generic regcred --from-file=.dockerconfigjson=config.json --type=kubernetes.io/dockerconfigjson`

Create *spark* service account:

`kubectl create serviceaccount spark`

`kubectl create clusterrolebinding spark-role --clusterrole=edit --serviceaccount=default:spark --namespace=default`

Launch cluster and copy master's address from `kubectl cluster-info`

Add spark's bin directory to your [path](https://askubuntu.com/questions/60218/how-to-add-a-directory-to-the-path), for example with `export PATH="/path/to/spark/bin:$PATH"`

Finally, run `./submit-example -m <MASTER_URL>` to test k8s with an example.

Old style command: `$SPARK_HOME/bin/spark-submit --master k8s://<MASTER_URL>:443 --deploy-mode cluster --name spark-pi --class org.apache.spark.examples.SparkPi --conf spark.executor.instances=3 --conf spark.kubernetes.container.image.pullSecrets=regcred --conf spark.kubernetes.authenticate.driver.serviceAccountName=spark --conf spark.kubernetes.container.image=gitlab.ensimag.fr:5050/sdtd1/projet-sdtd/spark:v0.1 local:///opt/spark/examples/jars/spark-examples_2.12–3.0.1.jar`


### Wordcounter
For the wordcounter, a fat jar including all dependencies is available on the container registry. The k8s addresses for kafka and mongo must be passed to spark as environment variables (update the KAFKA_ADDRESS and MONGO_ADDRESS strings in the following commands).

To run our wordcounter: `$SPARK_HOME/bin/spark-submit --master k8s://<MASTER_URL>:443 --deploy-mode cluster --name testwc --class fr.ensimag.sdtd.WordCounter --packages org.apache.spark:spark-sql-kafka-0-10_2.12:3.0.1,org.mongodb.spark:mongo-spark-connector_2.12:3.0.0 --conf spark.executor.instances=3 --conf spark.kubernetes.container.image.pullSecrets=regcred --conf spark.kubernetes.authenticate.driver.serviceAccountName=spark --conf spark.kubernetes.container.image=gitlab.ensimag.fr:5050/sdtd1/projet-sdtd/spark:wc_fat --conf spark.kubernetes.driverEnv.KAFKA_ADDRESS=kafkaa:9092 --conf spark.kubernetes.driverEnv.MONGO_ADDRESS=mongodb://mongo:27017/sdtd.wordcounts --conf spark.driver.extraJavaOptions=-Divy.cache.dir=/tmp --conf spark.driver.extraJavaOptions=-Divy.home=/tmp local:///opt/spark/target/scala-2.12/WordCounter-assembly-1.0.jar`

### Sentiment analysis

For the sentiment analysis, a fat jar including all dependencies is available on the container registry. The k8s addresses for kafka, for the mongo collections `sentiment` and `accuracy` and the model directory inside the container must be passed to spark as environment variables (update the KAFKA_ADDRESS, SENTIMENT_MONGO_ADDRESS, ACCURACY_MONGO_ADDRESS and MODEL_DIR strings in the following commands).

To start ml model: `$SPARK_HOME/bin/spark-submit --master k8s://<MASTER_URL>:443 --deploy-mode cluster --name testsa --class fr.ensimag.sdtd.SentimentTest --packages org.apache.spark:spark-sql-kafka-0-10_2.12:3.0.1,org.mongodb.spark:mongo-spark-connector_2.12:3.0.0 --conf spark.executor.instances=3 --conf spark.kubernetes.container.image.pullSecrets=regcred --conf spark.kubernetes.authenticate.driver.serviceAccountName=spark --conf spark.kubernetes.container.image=gitlab.ensimag.fr:5050/sdtd1/projet-sdtd/spark:sa_fat --conf spark.kubernetes.driverEnv.KAFKA_ADDRESS=kafkaa:9092 --conf spark.kubernetes.driverEnv.SENTIMENT_MONGO_ADDRESS=mongodb://mongo:27017/sdtd.sentiment --conf spark.kubernetes.driverEnv.ACCURACY_MONGO_ADDRESS=mongodb://mongo:27017/sdtd.accuracy --conf spark.kubernetes.driverEnv.MODEL_DIR=local:///opt/spark/model --conf spark.driver.extraJavaOptions=-Divy.cache.dir=/tmp --conf spark.driver.extraJavaOptions=-Divy.home=/tmp local:///opt/spark/target/scala-2.12/SentimentTest-assembly-1.0.jar`