/usr/local/spark/bin/spark-submit \
    --master k8s://https://api-myfirstcluster-k8s-lo-hqulii-548969031.us-east-1.elb.amazonaws.com \
    --deploy-mode cluster \
    --name spark \
    --class org.spark.App \
    --conf spark.kubernetes.authenticate.driver.serviceAccountName=spark \
    --conf spark.executor.instances=1 \
    --conf spark.kubernetes.executor.request.cores=0.1 \
    --conf spark.kubernetes.container.image=spark-prod:v1 \
    --conf spark.kubernetes.driverEnv.KAFKA_ADDRESS=kafkaa:9092 \
    --conf spark.kubernetes.driverEnv.KAFKA_MAIN_TOPIC=logs \
    --conf spark.kubernetes.driverEnv.KAFKA_GROUP_ID=spark-group \
    --conf spark.kubernetes.driverEnv.BATCH_SIZE=30 \
    --conf spark.kubernetes.driverEnv.PREVIOUS_BATCHES_NUMBER=3 \
    local:///opt/spark/work-dir/service.jar