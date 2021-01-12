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
