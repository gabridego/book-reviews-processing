kubectl apply -f ./secret.yaml

kubectl create -f ./my-mongo-operator/my-mongodb/mongodb.com_mongodb_crd.yaml
kubectl create -f ./my-mongo-operator/my-mongodb/operator/
kubectl apply -f ./my-mongo-operator/my-mongodb/mongodb-crd.yaml
kubectl apply -f ./kafka
#./spark/run-spark.sh
kubectl apply -f ./my-mongo-operator/apiserver
kubectl apply -f ./webserver
kubectl apply -f ./api-gateway
kubectl apply -f ./prometheus_grafana

kubectl create serviceaccount spark
kubectl create clusterrolebinding spark-role --clusterrole=edit --serviceaccount=default:spark --namespace=default

#kubectl proxy --port 8008 &

#spark-submit \
#	--master k8s://<MASTER_URL>:443 \
#	--deploy-mode cluster \
#	--name spark-sdtd \
#	--class fr.ensimag.sdtd.SparkSDTD \
#	--packages org.apache.spark:spark-sql-kafka-0-10_2.12:3.0.1,org.mongodb.spark:mongo-spark-connector_2.12:3.0.0 \
#	--conf spark.executor.instances=3 \
#	--conf spark.kubernetes.container.image.pullSecrets=myregistrykey \
#	--conf spark.kubernetes.authenticate.driver.serviceAccountName=spark \
#	--conf spark.kubernetes.container.image=gitlab.ensimag.fr:5050/sdtd1/projet-sdtd/spark:latest \
#	--conf spark.kubernetes.driverEnv.KAFKA_ADDRESS=kafkaa:9092 \
#	--conf spark.kubernetes.driverEnv.WC_MONGO_ADDRESS="mongodb://my-user:userPassword@db-svc.default.svc.cluster.local:27017/sdtddb.wordcount?replicaSet=db&authSource=admin" \
#	--conf spark.kubernetes.driverEnv.SENTIMENT_MONGO_ADDRESS="mongodb://my-user:userPassword@db-svc.default.svc.cluster.local:27017/sdtddb.sentiment?replicaSet=db&authSource=admin" \
#	--conf spark.kubernetes.driverEnv.ACCURACY_MONGO_ADDRESS="mongodb://my-user:userPassword@db-svc.default.svc.cluster.local:27017/sdtddb.accuracy?replicaSet=db&authSource=admin" \
#	--conf spark.kubernetes.driverEnv.MODEL_DIR=/opt/spark/model \
#	--conf spark.driver.extraJavaOptions=-Divy.cache.dir=/tmp \
#	--conf spark.driver.extraJavaOptions=-Divy.home=/tmp \
#	local:///opt/spark/target/scala-2.12/SparkSDTD-assembly-1.0.jar
