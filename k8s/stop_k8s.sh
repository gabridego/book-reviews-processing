kubectl delete -f ./api-gateway
kubectl delete -f ./webserver
kubectl delete -f ./apiserver
#stop spark please
kubectl delete -f ./kafka
kubectl delete -f ./db




