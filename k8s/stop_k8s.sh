kubectl delete -f ./api-gateway
kubectl delete -f ./webserver
kubectl delete -f ./apiserver
kubectl delete -f ./my-mongo-operator/apiserver
#stop spark please
kubectl delete -f ./kafka
kubectl delete -f ./db
kubectl delete -f ./my-mongo-operator/




