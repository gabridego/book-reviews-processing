spark-submit --kill default:spark-sdtd* --master k8s://http://127.0.0.1:8008

kubectl delete -f ./api-gateway
kubectl delete -f ./webserver
kubectl delete -f ./apiserver
kubectl delete -f ./my-mongo-operator/apiserver

kubectl delete -f ./kafka
kubectl delete -f ./db
kubectl delete -f ./my-mongo-operator/my-mongodb/
kubectl delete -f ./prometheus_grafana
