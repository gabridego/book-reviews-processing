# Projet SDTD

## Notes

1) kubectl create configmap apiserver-env-file --from-env-file=./apiserver-env-file.properties --save-config
2) kubectl get configmap apiserver-env-file -o yaml > ./apiserver-configmap.yaml

3) kubectl create configmap webserver-env-file --from-env-file=./webserver-env-file.properties --save-config
4) kubectl get configmap webserver-env-file -o yaml > ./webserver-configmap.yaml
5) name of db service should be mongo