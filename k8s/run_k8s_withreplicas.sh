kubectl create -f ./my-mongo-operator/mongodb.com_mongodb_crd.yaml
kubectl create -f ./my-mongo-operator/operator/
kubectl apply -f ./my-mongo-operator/mongodb-crd.yaml
kubectl apply -f ./kafka
#./spark/run-spark.sh
kubectl apply -f ./my-mongo-operator/apiserver
kubectl apply -f ./webserver
kubectl apply -f ./api-gateway