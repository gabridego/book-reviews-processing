kubectl apply -f ./db
kubectl apply -f ./kafka
#./spark/run-spark.sh
kubectl apply -f ./apiserver
kubectl apply -f ./webserver
kubectl apply -f ./api-gateway