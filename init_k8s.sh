cd k8s/db
kubectl apply -f .

cd ../apiserver
kubectl apply -f .

cd ../webserver
kubectl apply -f .

kubectl get services