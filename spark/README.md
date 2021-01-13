## To compile spark application
`sbt package` for running local, `sbt assembly` for building a fat jar.

## To test locally
Run the db:
`sudo docker run --name mymongo -p 27017:27017 -d mongo`

Create a Kafka topic named `quickstart-events` following the instructions [here](https://kafka.apache.org/quickstart) (`bin/zookeeper-server-start.sh config/zookeeper.properties` -> `bin/kafka-server-start.sh config/server.properties` -> `bin/kafka-topics.sh --create --topic quickstart-events --bootstrap-server localhost:9092`, `bin/kafka-console-producer.sh --topic quickstart-events --bootstrap-server localhost:9092`)

Locally submit the job (must have spark installed):

`$SPARK_HOME/bin/spark-submit --class fr.ensimag.sdtd.WordCounter --packages org.apache.spark:spark-sql-kafka-0-10_2.12:3.0.1,org.mongodb.spark:mongo-spark-connector_2.12:3.0.0 $PATH_TO_PROJECT/spark/final/target/scala-2.12/SparkSDTD-assembly-1.0.jar`

Start writing reviews in the Kafka producer terminal, with the format `{"reviewText": "<text>", "overall": 2.0}`.

To explore the results, `sudo docker exec -it mymongo mongo` to enter the mongodb shell. Then `use sdtd` to switch to our db, and `db.wordcounts.find()`, `db.sentiment.find()` or `db.accuracy.find()`.

## To test on k8s
Create k8s secret:
`kubectl create secret generic myregistrykey --from-file=.dockerconfigjson=config.json --type=kubernetes.io/dockerconfigjson`
or `kubectl apply -f $PATH_TO_PROJECT/k8s//secret.yaml`.

Create *spark* service account:

`kubectl create serviceaccount spark`

`kubectl create clusterrolebinding spark-role --clusterrole=edit --serviceaccount=default:spark --namespace=default`

Launch cluster and copy master's address from `kubectl cluster-info`

Add spark's bin directory to your [path](https://askubuntu.com/questions/60218/how-to-add-a-directory-to-the-path), for example with `export PATH="/path/to/spark/bin:$PATH"`

Finally, run `./submit-example -m <MASTER_URL>` to test k8s with an example.

Old style command: `$SPARK_HOME/bin/spark-submit --master k8s://<MASTER_URL>:443 --deploy-mode cluster --name spark-pi --class org.apache.spark.examples.SparkPi --conf spark.executor.instances=3 --conf spark.kubernetes.container.image.pullSecrets=regcred --conf spark.kubernetes.authenticate.driver.serviceAccountName=spark --conf spark.kubernetes.container.image=gitlab.ensimag.fr:5050/sdtd1/projet-sdtd/spark:v0.1 local:///opt/spark/examples/jars/spark-examples_2.12–3.0.1.jar`

### Full program

After k8s deployment with all running services, we can run our spark job, computing wordcounts and predictions on book reviews.

A fat jar including all dependencies is available on the container registry. The k8s addresses for kafka, for the mongo collections and the model directory inside the container must be passed to spark as environment variables (update the KAFKA_ADDRESS, WC_MONGO_ADDRESS, SENTIMENT_MONGO_ADDRESS, ACCURACY_MONGO_ADDRESS and MODEL_DIR strings in the following command).

`spark-submit --master k8s://<MASTER_URL>:443 --deploy-mode cluster --name spark-sdtd --class fr.ensimag.sdtd.SparkSDTD --packages org.apache.spark:spark-sql-kafka-0-10_2.12:3.0.1,org.mongodb.spark:mongo-spark-connector_2.12:3.0.0 --conf spark.executor.instances=3 --conf spark.kubernetes.container.image.pullSecrets=myregistrykey --conf spark.kubernetes.authenticate.driver.serviceAccountName=spark --conf spark.kubernetes.container.image=gitlab.ensimag.fr:5050/sdtd1/projet-sdtd/spark:latest --conf spark.kubernetes.driverEnv.KAFKA_ADDRESS=kafkaa:9092 --conf spark.kubernetes.driverEnv.WC_MONGO_ADDRESS="mongodb://my-user:userPassword@db-svc.default.svc.cluster.local:27017/sdtddb.wordcount?replicaSet=db&authSource=admin" --conf spark.kubernetes.driverEnv.SENTIMENT_MONGO_ADDRESS="mongodb://my-user:userPassword@db-svc.default.svc.cluster.local:27017/sdtddb.sentiment?replicaSet=db&authSource=admin" --conf spark.kubernetes.driverEnv.ACCURACY_MONGO_ADDRESS="mongodb://my-user:userPassword@db-svc.default.svc.cluster.local:27017/sdtddb.accuracy?replicaSet=db&authSource=admin" --conf spark.kubernetes.driverEnv.MODEL_DIR=/opt/spark/model --conf spark.driver.extraJavaOptions=-Divy.cache.dir=/tmp --conf spark.driver.extraJavaOptions=-Divy.home=/tmp local:///opt/spark/target/scala-2.12/SparkSDTD-assembly-1.0.jar`